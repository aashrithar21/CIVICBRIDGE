
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const { readData, writeData } = require("../utils/fileStore");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "../../uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }

    cb(null, true);
  },
});

const { departmentMap } = require("../utils/departments");

// Staff can only manage complaints routed to their own department; admins can manage all.
async function canManage(reqUser, complaint) {
  if (reqUser.role === "admin") return true;
  // Read the department from the user store so older sessions keep working.
  const users = await readData("users.json");
  const account = users.find((item) => item.id === reqUser.id);
  return Boolean(account && account.department && account.department === complaint.department);
}

const DEPARTMENT_DENIED = "This complaint belongs to another department";

function isValidCoordinate(value, min, max) {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max;
}

function findDuplicate(complaints, category, latitude, longitude) {
  if (
    latitude === undefined ||
    longitude === undefined ||
    latitude === "" ||
    longitude === ""
  ) {
    return null;
  }

  return complaints.find((complaint) => {
    if (
      complaint.category !== category ||
      complaint.latitude == null ||
      complaint.longitude == null ||
      ["Resolved", "Rejected"].includes(complaint.status)
    ) {
      return false;
    }

    const latDifference = Number(complaint.latitude) - Number(latitude);
    const lonDifference = Number(complaint.longitude) - Number(longitude);

    return (
      Math.sqrt(latDifference ** 2 + lonDifference ** 2) <= 0.001
    );
  }) || null;
}

// Create a complaint
router.post(
  "/",
  authenticateToken,
  authorizeRoles("citizen"),
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        address,
        latitude,
        longitude,
      } = req.body;

      const allowedCategories = Object.keys(departmentMap);

      if (![title, description, category, address].every(v => typeof v === "string" && v.trim())) {
        return res.status(400).json({
          success: false,
          message: "Title, description, category and address are required",
        });
      }

      if (
        !allowedCategories.includes(category) ||
        String(title).trim().length > 100 ||
        String(description).trim().length > 2000 ||
        String(address).trim().length > 300
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint details",
        });
      }

      if (
        !isValidCoordinate(latitude, -90, 90) ||
        !isValidCoordinate(longitude, -180, 180)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid GPS coordinates",
        });
      }

      const complaints = await readData("complaints.json");

      const duplicate = findDuplicate(
        complaints,
        category,
        latitude,
        longitude
      );

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "A similar active complaint already exists nearby",
          duplicateComplaint: {
            id: duplicate.id,
            title: duplicate.title,
            status: duplicate.status,
          },
        });
      }

      const complaint = {
        id: randomUUID(),
        complaintNumber: `CB-${Date.now()}`,
        title: String(title).trim(),
        description: String(description).trim(),
        category,
        department: departmentMap[category],
        address: String(address).trim(),
        latitude: latitude === undefined || latitude === ""
          ? null
          : Number(latitude),
        longitude: longitude === undefined || longitude === ""
          ? null
          : Number(longitude),
        image: req.file
          ? `/uploads/${req.file.filename}`
          : null,
        reportedBy: req.user.id,
        citizenName: req.user.name || req.user.email,
        status: "Submitted",
        priority: "Normal",
        supporters: [],
        updates: [
          {
            status: "Submitted",
            message: "Complaint submitted successfully",
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      complaints.push(complaint);
      await writeData("complaints.json", complaints);

      return res.status(201).json({
        success: true,
        message: "Complaint submitted successfully",
        complaint,
      });
    } catch (error) {
      console.error("Complaint creation error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to submit complaint",
      });
    }
  }
);

// Computed service indicators; seven-day demo service target.
function enrich(c) {
 const age = Math.max(0, Math.floor((Date.now()-new Date(c.createdAt))/86400000));
 const active = !['Resolved','Rejected'].includes(c.status);
 const score = Math.min(100, 20 + (['Road Damage','Water Leakage','Streetlight'].includes(c.category)?25:10) + Math.min(25,(c.supporters||[]).length*5) + Math.min(30,age*3));
 return {...c, priorityScore:score, overdue:active&&age>=7, escalated:active&&age>=14};
}
router.post('/:id/review', authenticateToken, authorizeRoles('citizen'), async (req,res)=>{
 try {
 const all=await readData('complaints.json'); const c=all.find(x=>x.id===req.params.id);
 if(!c) return res.status(404).json({message:'Complaint not found'});
 if(c.status!=='Resolved'||c.reportedBy!==req.user.id) return res.status(403).json({message:'Only the reporting citizen can review a resolved complaint'});
 const {action,rating}=req.body;
 if(action==='reopen'){c.status='Under Review'; c.verified=false; delete c.repairRating;}
 else if(action==='verify'&&Number.isInteger(rating)&&rating>=1&&rating<=5){c.verified=true;c.repairRating=rating;}
 else return res.status(400).json({message:'Invalid review'});
 c.updatedAt=new Date().toISOString(); c.updates.push({status:c.status,message:action==='reopen'?'Citizen reopened the issue':'Citizen verified the repair',updatedAt:c.updatedAt});
 await writeData('complaints.json',all);res.json({success:true,complaint:enrich(c),message:'Review saved'});
 }catch(e){res.status(500).json({message:'Unable to save review'});}
});
router.post('/:id/proof',authenticateToken,authorizeRoles('staff','admin'),upload.single('image'),async(req,res)=>{
 try{const all=await readData('complaints.json');const c=all.find(x=>x.id===req.params.id);if(!c||!req.file)return res.status(400).json({message:'Report and photograph required'});if(!(await canManage(req.user,c)))return res.status(403).json({success:false,message:DEPARTMENT_DENIED});c.resolutionImage='/uploads/'+req.file.filename;await writeData('complaints.json',all);res.json({success:true,complaint:enrich(c),message:'Repair photograph saved'});}catch(e){res.status(500).json({message:'Unable to save photograph'});}
});

// Get all public complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await readData("complaints.json");

    const {
      category,
      status,
      search,
    } = req.query;

    let filtered = complaints;

    if (category) {
      filtered = filtered.filter(
        (item) => item.category === category
      );
    }

    if (status) {
      filtered = filtered.filter(
        (item) => item.status === status
      );
    }

    if (search) {
      const term = String(search).toLowerCase();

      filtered = filtered.filter((item) =>
        `${item.title} ${item.description} ${item.address}`
          .toLowerCase()
          .includes(term)
      );
    }

    filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      success: true,
      count: filtered.length,
      complaints: filtered.map(enrich),
    });
  } catch (error) {
    console.error("Complaint retrieval error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve complaints",
    });
  }
});

// Get complaints submitted by logged-in citizen
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const complaints = await readData("complaints.json");

    const myComplaints = complaints.filter(
      (item) => item.reportedBy === req.user.id
    );

    return res.json({
      success: true,
      count: myComplaints.length,
      complaints: myComplaints.map(enrich),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your complaints",
    });
  }
});

// Get one complaint
router.get("/:id", async (req, res) => {
  try {
    const complaints = await readData("complaints.json");

    const complaint = complaints.find(
      (item) => item.id === req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.json({
      success: true,
      complaint: enrich(complaint),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve complaint",
    });
  }
});

// Support an existing complaint
router.post(
  "/:id/support",
  authenticateToken,
  async (req, res) => {
    try {
      const complaints = await readData("complaints.json");

      const complaint = complaints.find(
        (item) => item.id === req.params.id
      );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      if (complaint.reportedBy === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot support your own complaint",
        });
      }

      complaint.supporters ||= [];
      if (complaint.supporters.includes(req.user.id)) {
        return res.status(400).json({
          success: false,
          message: "You have already supported this complaint",
        });
      }

      complaint.supporters.push(req.user.id);
      complaint.updatedAt = new Date().toISOString();

      await writeData("complaints.json", complaints);

      return res.json({
        success: true,
        message: "Your support has been recorded",
        supportCount: complaint.supporters.length,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to support complaint",
      });
    }
  }
);

// Update complaint status (staff/admin only)
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("staff", "admin"),
  async (req, res) => {
    try {
      const { status, message } = req.body;

      const allowedStatuses = [
        "Submitted",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status",
        });
      }

      const complaints = await readData("complaints.json");

      const complaint = complaints.find(
        (item) => item.id === req.params.id
      );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      if (!(await canManage(req.user, complaint))) {
        return res.status(403).json({
          success: false,
          message: DEPARTMENT_DENIED,
        });
      }

      const now = new Date().toISOString();
      complaint.status = status;
      complaint.updatedAt = now;

      complaint.updates ||= [];
      complaint.updates.push({
        status,
        message: message || `Status changed to ${status}`,
        updatedBy: req.user.id,
        updatedByName: req.user.name,
        updatedByDepartment: req.user.department || null,
        updatedAt: now,
      });

      await writeData("complaints.json", complaints);

      return res.json({
        success: true,
        message: "Complaint status updated",
        complaint,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to update complaint status",
      });
    }
  }
);

// Multer and upload errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller"
        : error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }

  next();
});

module.exports = router;
