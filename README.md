# 🏙️ CivicBridge – Smart Civic Issue Reporting & Management System

### 🌉 Connecting Citizens. Improving Cities.

**CivicBridge** is a modern, full-stack civic engagement and public infrastructure management platform designed to bridge the communication gap between citizens and municipal authorities.

The platform empowers citizens to report public infrastructure issues, upload photographic evidence, mark precise geographical locations, track complaint progress, support community concerns and verify completed repairs.

It provides municipal departments with dedicated dashboards to manage complaints, prioritize infrastructure problems, update resolution statuses and evaluate departmental performance through automated analytical reports.

By combining technology, transparency, accountability and community participation, CivicBridge aims to contribute towards cleaner, safer, smarter and more sustainable cities.

---

## 📑 Table of Contents

- About the Project
- Problem Statement
- Proposed Solution
- Project Objectives
- Key Features
- Unique and Advanced Features
- User Roles
- Technology Stack
- System Architecture
- Project Structure
- Application Workflow
- Data Storage
- API Endpoints
- Installation and Setup
- Demo Accounts
- Application Screenshots
- Security Features
- Software Engineering Concepts
- Advantages
- Limitations
- Future Enhancements
- Developer Information

---

## 📖 About the Project

Public infrastructure plays a significant role in improving the quality of urban life. However, citizens frequently encounter problems such as damaged roads, overflowing garbage bins, water leakage, malfunctioning streetlights and drainage blockages.

Traditional complaint management systems often lack transparency, accessibility, efficient departmental coordination and proper resolution tracking.

CivicBridge addresses these challenges by providing a centralized digital platform where citizens and municipal authorities can collaborate effectively.

The application manages the complaint lifecycle, starting from issue identification and submission to departmental assignment, resolution and citizen verification.

CivicBridge goes beyond conventional complaint reporting by introducing community engagement, geographical visualization, rule-based issue prioritization, repair verification, gamification and automated departmental performance reporting.

---

## 🚨 Problem Statement

Many cities face difficulties in maintaining public infrastructure due to inefficient communication between citizens and responsible authorities.

### Major challenges include:

- ❌ Lack of a centralized infrastructure complaint reporting platform.
- ❌ Difficulty identifying the appropriate municipal department.
- ❌ Delayed responses to public infrastructure issues.
- ❌ Lack of transparency in complaint resolution.
- ❌ Duplicate complaints regarding the same infrastructure problem.
- ❌ Limited citizen participation in urban development.
- ❌ Absence of proper photographic and geographical evidence.
- ❌ Difficulty monitoring departmental performance.
- ❌ Lack of citizen verification after complaint resolution.
- ❌ Inefficient identification of overdue infrastructure complaints.

These challenges create dissatisfaction among citizens and reduce the effectiveness of municipal administration.

---

## 💡 Proposed Solution

CivicBridge provides an integrated digital solution that connects citizens, municipal department staff and city administrators through a unified web application.

The system allows citizens to submit infrastructure complaints with descriptions, categories, photographs and geographical coordinates.

Complaints are automatically routed to the relevant departments based on their categories.

Department staff can review assigned complaints, update their progress and upload repair evidence, while administrators can monitor city-wide infrastructure performance.

Citizens can track their complaints, support existing reports and verify whether reported issues have been properly resolved.

The platform promotes accountability through public transparency dashboards and automated monthly performance reports.

---

## 🎯 Project Objectives

- 🌐 Develop a centralized platform for civic issue reporting.
- 🤝 Improve communication between citizens and municipal authorities.
- 📍 Enable accurate geographical identification of infrastructure issues.
- 📸 Support photographic evidence for complaint reporting and resolution.
- 🏢 Automate category-based departmental assignment.
- 🔍 Improve transparency throughout the complaint lifecycle.
- ⏳ Identify overdue complaints and issues requiring escalation.
- 📊 Provide meaningful infrastructure performance analytics.
- 🏆 Encourage active citizen participation through gamification.
- ⭐ Enable citizens to evaluate completed repairs.
- 🏙️ Support smarter and more sustainable urban management.

---

# ✨ Key Features

## 1. 🔐 Secure Authentication and Role-Based Access

CivicBridge provides separate authentication portals for citizens and municipal authorities.

### Citizen Authentication

- Citizen account registration.
- Secure email and password login.
- Personal dashboard access.
- Authenticated complaint submission.
- Personal complaint history.
- Civic Impact Score and achievement tracking.

### Department Authentication

- Separate department login portal.
- Department selection during login.
- Staff and administrator authentication.
- Department-specific access permissions.
- Restricted access to unauthorized dashboards.

The backend uses JSON Web Tokens (JWT) for authentication and bcryptjs for password hashing.

Role-based authorization ensures that users can access only the functionalities permitted for their respective roles.

---

## 2. 📝 Smart Civic Issue Reporting

Citizens can report public infrastructure problems through a dedicated complaint submission interface.

The reporting process includes:

- Complaint title.
- Detailed issue description.
- Infrastructure category.
- Location information.
- Geographical coordinates.
- Optional photographic evidence.

The submitted complaint is stored in the backend and routed to the appropriate municipal department.

Each complaint receives a unique identifier, allowing citizens and authorities to access and track the report.

---

## 3. 📸 Photograph-Based Complaint Reporting

Citizens can upload photographs of infrastructure problems while submitting complaints.

Photographic evidence helps authorities understand the nature and condition of reported issues.

### Benefits

- Improved understanding of infrastructure damage.
- Better complaint documentation.
- Easier assessment of reported problems.
- Increased accountability.
- Visual comparison with repair evidence.

Uploaded images are managed using Multer and stored in the backend uploads directory.

---

## 4. 📍 GPS Location Tagging

CivicBridge supports geographical location tagging to identify the exact position of reported infrastructure problems.

Citizens can:

- Capture their current location using browser geolocation.
- Select a location manually on an interactive map.
- Associate latitude and longitude coordinates with complaints.
- View the geographical position of reported issues.

This functionality helps municipal authorities locate infrastructure problems more efficiently.

Browser location permission is required for automatic GPS capture.

---

## 5. 🗺️ Interactive City Issue Map

The interactive city map provides a geographical representation of reported infrastructure problems.

It is implemented using Leaflet and OpenStreetMap.

### Map functionalities

- Display reported issues as geographical markers.
- Visualize complaints using status-based marker colors.
- Explore infrastructure problems across different locations.
- Filter displayed complaints.
- Access complaint details from map markers.
- Identify areas with concentrated infrastructure problems.

The application also uses overlapping geographical circles to provide a visual indication of complaint density.

Internet access is required to load OpenStreetMap tiles.

---

## 6. 🏢 Automatic Department Assignment

Complaints are automatically routed to the appropriate municipal department according to their selected category.

| Infrastructure Problem | Responsible Department |
|---|---|
| Damaged roads and potholes | Public Works Department |
| Garbage and sanitation issues | Sanitation Department |
| Water leakage and supply issues | Water Supply Department |
| Damaged streetlights and electrical issues | Electrical Department |
| Drainage and blockage problems | Drainage Department |
| Other civic infrastructure issues | General Administration |

This reduces the need for citizens to manually identify the responsible authorities.

Department staff can access and manage complaints assigned to their own department.

---

## 7. 📋 Complaint Status Tracking

CivicBridge provides a structured complaint lifecycle that enables citizens to monitor the progress of their reports.

### Complaint statuses

| Status | Description |
|---|---|
| 📨 Submitted | Complaint has been successfully submitted. |
| 🔍 Under Review | Complaint is being examined by authorities. |
| 🏢 Assigned | Complaint has been assigned for further action. |
| 🛠️ In Progress | Work is underway to resolve the issue. |
| ✅ Resolved | The issue has been marked as resolved. |
| ❌ Rejected | The complaint has been rejected by authorities. |

Complaint history records status changes, helping citizens understand the progress of reported problems.

---

## 8. 🔎 Duplicate Complaint Detection

Multiple citizens may report the same infrastructure problem.

CivicBridge includes duplicate complaint detection to identify potentially similar existing reports.

Instead of unnecessarily creating repeated complaints, citizens can support an existing report.

### Benefits

- Reduces redundant complaint records.
- Improves departmental workload management.
- Consolidates community concerns.
- Helps authorities focus on distinct infrastructure problems.

---

## 9. 👍 Community Support System

Citizens can support infrastructure complaints submitted by other members of the community.

The community support system enables residents to collectively highlight important infrastructure concerns.

Reports receiving greater community support can contribute to the rule-based priority assessment.

This feature encourages collaboration and gives citizens an opportunity to participate beyond submitting individual complaints.

---

## 10. 🔍 Explore Public Issues

The Explore Issues page allows users to browse infrastructure complaints reported through CivicBridge.

### Available functionalities

- Browse public complaint records.
- Filter complaints by category.
- Filter complaints by status.
- Sort complaint records.
- Reset applied filters.
- Save reports locally in the browser.
- Access detailed complaint information.
- Copy complaint links for sharing.
- View associated geographical locations.

The page improves public awareness of infrastructure conditions and ongoing municipal activities.

---

## 11. 👤 Personalized Citizen Dashboard

The citizen dashboard provides a centralized overview of an individual citizen's activities.

Citizens can access:

- Personal complaint records.
- Complaint progress information.
- Complaint statistics.
- Quick access to issue reporting.
- Civic Impact Score summary.
- Personal civic achievements.
- Complaint history.

The dashboard is designed to simplify interaction with the platform and provide relevant information without unnecessary complexity.

---

## 12. 🏛️ Department Staff Dashboard

Municipal staff members receive a dedicated dashboard for managing infrastructure complaints assigned to their department.

### Staff functionalities

- View department-specific complaints.
- Review complaint information.
- Examine uploaded photographic evidence.
- Access reported geographical locations.
- Monitor complaint priorities.
- Update complaint statuses.
- Identify overdue complaints.
- Upload repair proof.
- Access monthly departmental performance reports.

Department-based authorization prevents staff members from managing complaints belonging to unrelated departments.

---

## 13. 👨‍💼 Administrator Dashboard

The administrator dashboard provides a broader overview of infrastructure management across the city.

### Administrator functionalities

- Monitor complaints across all departments.
- View city-wide complaint statistics.
- Review complaint resolution progress.
- Update complaint statuses.
- Identify overdue and escalation-due issues.
- Compare departmental performance.
- Access monthly city-wide reports.
- Filter reports by department.
- Regenerate completed monthly reports.

The administrator role supports centralized monitoring and evaluation of municipal operations.

---

## 14. 📊 Public Transparency Dashboard

CivicBridge promotes transparency by providing publicly accessible infrastructure statistics.

The transparency dashboard presents information derived from stored complaint records.

### Dashboard insights

- Total reported complaints.
- Resolved complaints.
- Ongoing infrastructure issues.
- Complaint status distribution.
- Department-wise performance.
- Departmental resolution rates.

This allows citizens to understand how infrastructure complaints are being handled.

---

# 🚀 Unique and Advanced Features

## 15. ⚡ Intelligent Rule-Based Priority Assessment

Not every infrastructure problem requires the same level of attention.

CivicBridge includes a rule-based priority assessment mechanism that considers factors such as:

- Infrastructure issue category.
- Community support.
- Complaint age.

This helps authorities identify complaints that may require greater attention.

### Advantages

- Improved complaint prioritization.
- Better allocation of departmental attention.
- Recognition of significant community concerns.
- Identification of long-pending issues.

The priority mechanism uses predefined computational rules rather than artificial intelligence or machine learning.

---

## 16. ⏰ Overdue Complaint and Escalation Indicators

CivicBridge monitors the age of unresolved infrastructure complaints.

| Duration | Indicator |
|---|---|
| 7 days | Overdue complaint |
| 14 days | Escalation due |

These indicators help authorities recognize infrastructure issues that have remained unresolved for extended periods.

### Benefits

- Encourages timely complaint resolution.
- Improves administrative accountability.
- Highlights long-pending infrastructure problems.
- Supports departmental performance evaluation.

The system displays computed escalation indicators. It does not automatically send escalation notifications to external authorities.

---

## 17. 🛠️ Repair Proof and Resolution Verification

Conventional complaint systems may mark an issue as resolved without providing sufficient evidence of completed work.

CivicBridge introduces a repair verification mechanism to improve accountability.

### Department Staff

- Upload photographic evidence of completed repairs.
- Update the complaint resolution status.
- Provide documented evidence of corrective action.

### Citizens

- Review the completed repair.
- Verify the resolution.
- Provide a repair rating.
- Reopen the complaint when the resolution is unsatisfactory.

This creates a feedback loop between citizens and municipal authorities.

---

## 18. ⭐ Citizen Feedback and Repair Ratings

Citizens can evaluate completed infrastructure repairs through the resolution feedback mechanism.

The feedback system helps authorities understand whether completed work satisfies the expectations of the reporting citizen.

### Benefits

- Improves service accountability.
- Encourages quality infrastructure repairs.
- Supports citizen satisfaction assessment.
- Helps identify inadequate resolutions.
- Contributes to monthly performance analytics.

---

## 19. 🏆 Civic Impact Score

The Civic Impact Score is a gamification feature designed to encourage meaningful citizen participation.

Citizens earn points by contributing to infrastructure improvement through complaint reporting, photographic evidence, community support and repair verification.

The score is dynamically calculated from actual stored complaint records.

### 🎮 Points System

| Civic Activity | Points |
|---|---:|
| Submit a non-rejected complaint | +10 |
| Include a photograph | +5 |
| Successfully resolved complaint | +20 |
| Verify and rate a completed repair | +10 |
| Support another citizen's complaint | +3 |
| Receive a supporter on a complaint | +2 |

Supporting other citizens' complaints earns points for the first 20 supported reports.

Received support points are limited to the first five supporters per eligible complaint.

### 📈 Civic Achievement Levels

| Level | Required Points |
|---|---:|
| 🌱 Newcomer | 0 |
| 🤝 Contributor | 25 |
| ⚡ Active Citizen | 75 |
| 🏅 Community Champion | 150 |
| 🛡️ City Guardian | 300 |

Citizens can view their current level, total score, progress towards the next level and contribution breakdown.

---

## 20. 🎖️ Achievement Badges

CivicBridge rewards meaningful civic activities through achievement badges.

| Badge | Achievement Requirement |
|---|---|
| 🚩 First Report | Submit the first eligible complaint. |
| 🛡️ Neighbourhood Watch | Submit five eligible complaints. |
| 📷 Photo Witness | Include photographs in three eligible reports. |
| 🧩 All-Rounder | Report issues in three different categories. |
| 📢 Community Voice | Support five other citizens' complaints. |
| ❤️ Crowd Favourite | Receive three supporters on one report. |
| ✅ Problem Solver | Have three complaints resolved. |
| ⭐ Repair Verifier | Verify and rate a completed repair. |

The badge system encourages consistent and constructive participation in community development.

---

## 21. 🥇 Civic Leaderboard

The Civic Leaderboard recognizes citizens who actively contribute to infrastructure improvement.

Citizens are ranked according to their Civic Impact Scores.

### Leaderboard features

- Score-based citizen rankings.
- Civic achievement levels.
- Earned badge counts.
- Personal ranking information.
- Shared ranks for equal scores.
- Privacy-conscious display names.

The leaderboard displays first names and surname initials instead of exposing complete names and other citizens' account identifiers.

---

## 22. 📅 Automated Monthly Civic Performance Reports

One of the advanced features of CivicBridge is automated monthly infrastructure performance reporting.

The reporting system transforms stored complaint records into meaningful performance insights for municipal authorities.

### 📊 Monthly Report Contents

- Total complaints received.
- Total complaints resolved.
- Complaint resolution rate.
- Average resolution duration.
- Percentage resolved within the seven-day target.
- Open complaint backlog.
- Overdue complaints.
- Escalation-due complaints.
- Department-wise performance.
- Category-wise complaint distribution.
- Citizen repair ratings.
- Previous-month performance comparison.
- Automatically generated performance highlights.

### ⚙️ Automated Report Generation

The backend checks for missing completed-month reports when the server starts and every six hours afterward.

Reports for completed months are generated and stored automatically when required.

If the server was unavailable during a month transition, missing reports can be generated when it starts again.

The current month's report is calculated dynamically as a month-to-date report.

### 📈 Department Performance Rating

| Rating | Criteria |
|---|---|
| 🟢 Good | Resolution rate of at least 70% with no escalation-due complaints. |
| 🟡 Fair | Performance that falls between the Good and Needs Attention conditions. |
| 🔴 Needs Attention | Resolution rate below 40% or any escalation-due complaint. |

The resolution rate is calculated using:

**Resolution Rate = Resolved Complaints ÷ (Opening Backlog + Received Complaints) × 100**

Monthly calculations follow UTC calendar months.

### 📥 Report Export

Municipal authorities can:

- Download reports in CSV format.
- Print performance reports.
- Save reports as PDF using browser printing.
- Review previous monthly reports.

Staff members can access reports for their own department, while administrators can access city-wide and department-specific reports.

---

## 23. 🎨 Premium and Responsive UI/UX

CivicBridge is designed to provide a modern, professional and user-friendly digital experience.

### Design characteristics

- Clean and consistent visual hierarchy.
- Responsive page layouts.
- Modern dashboard interfaces.
- Reusable UI components.
- Interactive maps and charts.
- Status-based visual indicators.
- Animated statistics.
- Smooth interface transitions.
- Loading skeletons.
- Empty-state and error-state components.
- Keyboard-accessible navigation.
- Reduced-motion support.
- Consistent typography and spacing.

The frontend also uses route-level lazy loading to reduce the initial application loading workload.

---

# 👥 User Roles and Permissions

CivicBridge supports three primary user roles.

| Functionality | Citizen | Department Staff | Administrator |
|---|:---:|:---:|:---:|
| View public issues | ✅ | ✅ | ✅ |
| Access public city map | ✅ | ✅ | ✅ |
| View transparency dashboard | ✅ | ✅ | ✅ |
| Submit complaints | ✅ | ❌ | ❌ |
| Upload complaint photographs | ✅ | ❌ | ❌ |
| Support community complaints | ✅ | ❌ | ❌ |
| Track personal complaints | ✅ | ❌ | ❌ |
| Access Civic Impact Score | ✅ | ❌ | ❌ |
| Verify and rate repairs | ✅ | ❌ | ❌ |
| Manage departmental complaints | ❌ | ✅ | ✅ |
| Update complaint statuses | ❌ | ✅ | ✅ |
| Upload repair evidence | ❌ | ✅ | ✅ |
| Access monthly department reports | ❌ | ✅ | ✅ |
| Monitor all departments | ❌ | ❌ | ✅ |
| Regenerate completed monthly reports | ❌ | ❌ | ✅ |

Public visitors can browse public issues, maps and transparency information without accessing protected dashboards.

---

# 🛠️ Technology Stack

## 🎨 Frontend Technologies

| Technology | Purpose |
|---|---|
| React | Component-based user interface development |
| TypeScript | Type-safe frontend development |
| Vite | Development server and frontend build tooling |
| Tailwind CSS | Responsive styling and layout development |
| React Router DOM | Client-side routing and protected navigation |
| Axios | Communication with backend REST APIs |
| Framer Motion | Interface animations and transitions |
| Lucide React | Modern interface icons |
| Leaflet | Interactive geographical maps |
| React Leaflet | React integration for Leaflet |
| OpenStreetMap | Geographical map tiles |
| Recharts | Data visualization and analytical charts |
| React Hook Form | Form state management |
| Zod | Schema-based validation |
| Oxlint | Frontend code linting |

## ⚙️ Backend Technologies

| Technology | Purpose |
|---|---|
| Node.js | JavaScript server-side runtime |
| Express.js | REST API development |
| JavaScript | Backend application logic |
| JSON Web Token | Token-based authentication |
| bcryptjs | Secure password hashing |
| Multer | Complaint and repair image uploads |
| CORS | Cross-origin request configuration |
| dotenv | Environment variable management |
| Nodemon | Automatic development server restart |
| Node.js File System | Persistent JSON data management |

## 🗄️ Data Storage

| Technology | Purpose |
|---|---|
| JSON File Storage | Persistent structured application data |
| users.json | User accounts and role information |
| complaints.json | Complaint records and related activities |
| monthly-reports.json | Generated monthly performance reports |
| Local File Storage | Uploaded complaint and repair photographs |

CivicBridge currently uses a lightweight JSON-based persistent data storage system instead of a separate relational or NoSQL database server.

## 💻 Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Web browser developer tools
- PowerShell / Terminal

---

# 🏗️ System Architecture

CivicBridge follows a three-layer full-stack architecture.

```text
┌──────────────────────────────────────┐
│                USERS                 │
│    Citizens | Staff | Administrators │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│       PRESENTATION LAYER             │
│                                      │
│  React + TypeScript + Tailwind CSS   │
│  Dashboards | Forms | Maps | Charts  │
└──────────────────┬───────────────────┘
                   │
              REST API / HTTP
                   │
                   ▼
┌──────────────────────────────────────┐
│        APPLICATION LAYER             │
│                                      │
│        Node.js + Express.js         │
│                                      │
│  Authentication & Authorization      │
│  Complaint Management                │
│  Department Assignment               │
│  Civic Impact Calculation            │
│  Monthly Report Generation           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│           DATA STORAGE LAYER         │
│                                      │
│  users.json                          │
│  complaints.json                     │
│  monthly-reports.json                │
│  Uploaded Images                     │
└──────────────────────────────────────┘
```

### 1. Presentation Layer

Responsible for displaying the user interface and collecting user inputs.

It includes dashboards, complaint forms, interactive maps, authentication pages and analytical visualizations.

### 2. Application Layer

Responsible for processing requests and implementing business logic.

It manages authentication, authorization, complaint operations, departmental routing, impact calculations and report generation.

### 3. Data Storage Layer

Responsible for maintaining persistent application records.

It stores user information, complaints, status histories, community support, repair feedback, monthly reports and uploaded images.

---

# 📂 Project Structure

```text
CivicBridge/
│
├── frontend/
│   ├── public/
│   │   ├── map/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── home/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── hooks/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.tsx
│   │   │   │
│   │   │   ├── citizen/
│   │   │   │   ├── CitizenDashboard.tsx
│   │   │   │   ├── ImpactScore.tsx
│   │   │   │   └── MyComplaints.tsx
│   │   │   │
│   │   │   ├── staff/
│   │   │   │   ├── StaffDashboard.tsx
│   │   │   │   └── MonthlyReports.tsx
│   │   │   │
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── DepartmentLogin.tsx
│   │   │   ├── ReportIssue.tsx
│   │   │   ├── ExploreIssues.tsx
│   │   │   ├── IssueDetails.tsx
│   │   │   ├── CityMap.tsx
│   │   │   └── Transparency.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── backend/
│   ├── data/
│   │   ├── users.json
│   │   ├── complaints.json
│   │   └── monthly-reports.json
│   │       (generated when required)
│   │
│   ├── uploads/
│   ├── scripts/
│   │   └── createUser.js
│   │
│   ├── src/
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── complaintRoutes.js
│   │   │   ├── impactRoutes.js
│   │   │   └── reportRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   ├── fileStore.js
│   │   │   ├── departments.js
│   │   │   ├── impact.js
│   │   │   ├── monthlyReport.js
│   │   │   └── reportScheduler.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── DESIGN-REVIEW.md
└── README.md
```

---

# 🔄 Application Workflow

## 👤 Citizen Workflow

```text
Register / Login
       ↓
Access Citizen Dashboard
       ↓
Report Infrastructure Issue
       ↓
Select Category and Enter Details
       ↓
Upload Optional Photograph
       ↓
Capture GPS / Select Map Location
       ↓
Submit Complaint
       ↓
Automatic Department Routing
       ↓
Track Complaint Progress
       ↓
Review Completed Repair
       ↓
Verify and Rate / Reopen Complaint
       ↓
Update Civic Impact Score
```

## 🏢 Department Staff Workflow

```text
Department Login
       ↓
Access Department Dashboard
       ↓
View Assigned Complaints
       ↓
Review Issue Details and Evidence
       ↓
Assess Priority and Complaint Age
       ↓
Update Complaint Status
       ↓
Perform Corrective Action
       ↓
Upload Repair Evidence
       ↓
Mark Complaint as Resolved
       ↓
Review Department Performance
```

## 👨‍💼 Administrator Workflow

```text
Administrator Login
       ↓
Access Administrator Dashboard
       ↓
Monitor City-Wide Complaints
       ↓
Review Departmental Performance
       ↓
Identify Pending and Overdue Issues
       ↓
Monitor Resolution Activities
       ↓
Access Monthly Performance Reports
       ↓
Export Reports for Evaluation
```

---

# 🗄️ Data Storage Design

CivicBridge uses persistent JSON file storage to maintain structured application data.

## 👤 User Records

User records contain information such as:

- Unique user identifier.
- Full name.
- Email address.
- Phone number.
- Hashed password.
- User role.
- Assigned department.
- Account creation timestamp.

## 📋 Complaint Records

Complaint records maintain information related to:

- Unique complaint identifier.
- Complaint title and description.
- Infrastructure category.
- Location information.
- Latitude and longitude.
- Uploaded photograph.
- Reporting citizen.
- Responsible department.
- Complaint status.
- Status history.
- Community supporters.
- Repair evidence.
- Citizen verification and rating.
- Complaint timestamps.

## 📊 Monthly Report Records

Monthly reports store calculated infrastructure performance information for completed months.

They support historical analysis, department comparison and administrative evaluation.

## 💾 Data Persistence

The backend uses Node.js file system operations to read and write JSON records.

The file storage utility writes updated data to a temporary file before renaming it to the target file.

Missing data files can be initialized automatically when required.

This approach simplifies local installation because no external database server is necessary.

---

# 🔌 REST API Endpoints

The backend exposes REST APIs for authentication, complaint management, civic impact calculation and monthly reporting.

## 🔐 Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/departments` | Retrieve available departments |
| POST | `/api/auth/register` | Register a citizen |
| POST | `/api/auth/citizen/login` | Authenticate a citizen |
| POST | `/api/auth/department/login` | Authenticate department staff or administrator |
| GET | `/api/auth/me` | Retrieve authenticated user information |

## 📝 Complaint APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/complaints` | Retrieve public complaints |
| POST | `/api/complaints` | Submit a new complaint |
| GET | `/api/complaints/my` | Retrieve personal complaints |
| GET | `/api/complaints/:id` | Retrieve specific complaint details |
| POST | `/api/complaints/:id/review` | Submit repair verification or feedback |
| POST | `/api/complaints/:id/proof` | Upload repair evidence |

The complaint API also supports community support operations and authorized complaint status updates.

## 🏆 Civic Impact APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/impact/me` | Retrieve personal impact score and badges |
| GET | `/api/impact/leaderboard` | Retrieve citizen rankings |

## 📅 Monthly Report APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/monthly` | Retrieve available monthly reports |
| GET | `/api/reports/monthly/:month` | Retrieve a specific monthly report |
| POST | `/api/reports/monthly/:month/regenerate` | Regenerate a completed monthly report |

## 💚 Server Health API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend server availability |

---

# ⚙️ Installation and Setup

Follow these instructions to run CivicBridge on your local machine.

## 📌 Prerequisites

Ensure the following software is installed:

- Node.js 22.16 or newer, preferably a supported LTS release.
- npm.
- Git.
- Visual Studio Code.
- A modern web browser.
- Internet connection for dependency installation and online map tiles.

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/aashrithar21/CIVIC_BRIDGE.git
```

Navigate to the project directory:

```bash
cd CIVIC_BRIDGE
```

Alternatively, download and extract the project ZIP file.

## 2️⃣ Open the Project in VS Code

```bash
code .
```

## 3️⃣ Configure the Backend

Open a terminal in the project root.

```bash
cd backend
npm ci
```

Create or configure the `.env` file inside the backend directory.

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Use a strong, randomly generated JWT secret.

Do not commit production secrets to GitHub.

## 4️⃣ Start the Backend Server

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

To verify the backend:

```text
http://localhost:5000/api/health
```

## 5️⃣ Configure the Frontend

Open a second terminal from the project root.

```bash
cd frontend
npm ci
```

## 6️⃣ Start the Frontend

```bash
npm run dev -- --port 5173 --strictPort
```

Open the application in your browser:

```text
http://localhost:5173
```

Both the frontend and backend servers must remain running.

## 7️⃣ Create a Production Frontend Build

```bash
cd frontend
npm run build
```

Preview the generated build:

```bash
npm run preview
```

## 8️⃣ Run Frontend Linting

```bash
cd frontend
npm run lint
```

---

# 🔑 Demo Login Accounts

The project includes demonstration accounts for exploring its different user roles.

These credentials are intended exclusively for local demonstration and academic evaluation.

## 👤 Citizen Accounts

Login portal: `/login`

| Email | Password |
|---|---|
| citizen1@civicbridge.test | Civic@12345 |
| citizen2@civicbridge.test | Citizen2@12345 |

## 🏢 Department Staff Accounts

Login portal: `/department/login`

| Department | Email | Password |
|---|---|---|
| Public Works | staff@civicbridge.test | Staff@12345 |
| Sanitation | staff.sanitation@civicbridge.test | Staff@12345 |
| Water Supply | staff.water@civicbridge.test | Staff@12345 |
| Electrical | staff.electrical@civicbridge.test | Staff@12345 |
| Drainage | staff.drainage@civicbridge.test | Staff@12345 |
| General Administration | staff.general@civicbridge.test | Staff@12345 |

## 👨‍💼 Administrator Account

| Department | Email | Password |
|---|---|---|
| City Administration | admin@civicbridge.test | Admin@12345 |

Select the correct department when signing in through the department portal.

Change or remove demonstration credentials before deploying the application publicly.

## ➕ Creating Additional Staff Accounts

From the backend directory:

```bash
node scripts/createUser.js "Staff Name" "staff@example.com" "StrongPassword123" staff "Sanitation Department"
```

## ➕ Creating an Administrator Account

```bash
node scripts/createUser.js "Admin Name" "admin@example.com" "StrongPassword123" admin
```

---

# 📸 Application Screenshots

The following screenshots demonstrate the major interfaces and functionalities of CivicBridge.

## 🏠 Home Page

The landing page introduces CivicBridge and provides access to infrastructure reporting, public complaints, city maps and transparency information.

![Home Page](screenshots/home.png)

## 🔐 Citizen Login

Secure authentication interface for citizens.

![Citizen Login](screenshots/citizen-login.png)

## 📝 Citizen Registration

Account creation interface for new citizens.

![Registration](screenshots/register.png)

## 🏢 Department Login

Dedicated authentication portal for municipal department staff and administrators.

![Department Login](screenshots/department-login.png)

## 👤 Citizen Dashboard

Personalized dashboard displaying complaint information and civic contributions.

![Citizen Dashboard](screenshots/citizen-dashboard.png)

## 📋 Report an Issue

Complaint submission interface supporting issue details, photographs and geographical location selection.

![Report Issue](screenshots/report-issue.png)

## 🔍 Explore Issues

Public infrastructure complaint browsing interface with filters and sorting.

![Explore Issues](screenshots/explore-issues.png)

## 📄 Complaint Details

Detailed complaint information, status history, community support and repair evidence.

![Complaint Details](screenshots/issue-details.png)

## 🗺️ Interactive City Map

Geographical visualization of reported infrastructure issues.

![City Map](screenshots/city-map.png)

## 📁 My Complaints

Personal complaint history and progress tracking.

![My Complaints](screenshots/my-complaints.png)

## 🏆 Civic Impact Score

Gamification dashboard displaying contribution points, achievement levels and badges.

![Civic Impact Score](screenshots/impact-score.png)

## 🥇 Civic Leaderboard

Citizen rankings based on meaningful community contributions.

![Leaderboard](screenshots/leaderboard.png)

## 🏛️ Department Staff Dashboard

Department-specific complaint management and resolution interface.

![Staff Dashboard](screenshots/staff-dashboard.png)

## 👨‍💼 Administrator Dashboard

Centralized monitoring of city-wide infrastructure complaints.

![Admin Dashboard](screenshots/admin-dashboard.png)

## 📊 Public Transparency Dashboard

Public infrastructure statistics and departmental resolution performance.

![Transparency Dashboard](screenshots/transparency.png)

## 📅 Monthly Performance Reports

Automated analytical reports displaying departmental performance and infrastructure resolution metrics.

![Monthly Reports](screenshots/monthly-reports.png)

## ⭐ Repair Verification

Citizen feedback and verification interface for completed infrastructure repairs.

![Repair Verification](screenshots/repair-verification.png)

---

# 🔒 Security Features

CivicBridge incorporates several application-level security mechanisms.

- 🔐 Password hashing using bcryptjs.
- 🎫 JWT-based user authentication.
- 🛡️ Role-based access control.
- 🏢 Department-specific complaint authorization.
- 🚧 Protected frontend routes.
- 🔍 Backend authentication middleware.
- 📝 Form and request validation.
- 🌐 Configured CORS restrictions.
- 🔑 Environment-based secret configuration.
- 👤 Privacy-conscious leaderboard display.
- 🚪 Separate citizen and department authentication portals.

These mechanisms provide a foundation for secure local application usage. Additional security hardening is required before production deployment.

---

# 🧩 Software Engineering Concepts Applied

CivicBridge demonstrates several important software engineering and system design principles.

## 📐 Modular Architecture

The application is divided into independent modules for authentication, complaint management, civic impact and monthly reporting.

This improves maintainability and simplifies future enhancements.

## ♻️ Component Reusability

The frontend uses reusable React components for navigation, layouts, status indicators, loading states and other interface elements.

This reduces code duplication and maintains visual consistency.

## 🔗 Separation of Concerns

Frontend presentation, backend business logic and data storage responsibilities are separated.

This makes the application easier to understand, maintain and extend.

## 🌐 RESTful API Design

The frontend communicates with the backend through HTTP-based REST APIs.

This provides a structured interface between client-side and server-side functionalities.

## 🛡️ Authentication and Authorization

The system distinguishes between user identity verification and permission management.

Different user roles receive different levels of access.

## 📊 Data-Driven Decision Support

The application converts complaint records into meaningful statistics, priority indicators and performance reports.

## ⚙️ Process Automation

The monthly reporting scheduler automates the generation of historical infrastructure performance reports.

## 👥 User-Centered Design

The application is designed around the needs of citizens, municipal staff and administrators through role-specific interfaces.

---

# 🌟 Advantages of CivicBridge

- Provides a centralized civic complaint management platform.
- Improves communication between citizens and authorities.
- Enables location-based infrastructure reporting.
- Supports photographic documentation.
- Reduces redundant complaint submissions.
- Encourages community participation.
- Improves complaint tracking and transparency.
- Supports category-based departmental routing.
- Highlights overdue infrastructure issues.
- Promotes accountability through repair verification.
- Encourages civic engagement through gamification.
- Provides automated infrastructure performance analytics.
- Simplifies local installation using JSON storage.
- Offers a responsive and modern user interface.

---

# 🧪 Testing and Verification

The project includes previous development verification covering frontend TypeScript checks, backend complaint workflows and selected calculation modules.

The following scenarios are important for application testing:

| Test Scenario | Expected Result |
|---|---|
| Citizen registration | A new citizen account is created. |
| Valid citizen login | Citizen dashboard becomes accessible. |
| Invalid login | Authentication is rejected. |
| Incorrect department selection | Department login is rejected. |
| Complaint submission | Complaint is stored successfully. |
| Photograph upload | Uploaded image is associated with the complaint. |
| Location selection | Geographical coordinates are stored. |
| Department routing | Complaint reaches the relevant department. |
| Duplicate complaint detection | Potentially repeated reports are identified. |
| Unauthorized access | Restricted operations are denied. |
| Community support | Complaint support information is updated. |
| Status update | Authorized status changes are recorded. |
| Repair verification | Citizen feedback is recorded. |
| Impact calculation | Points and achievements reflect eligible activities. |
| Monthly reporting | Performance metrics are calculated from stored records. |
| CSV export | Monthly report data can be downloaded. |

The full production build, browser compatibility and complete end-to-end testing should be performed after installing dependencies locally.

---

# ⚠️ Current Limitations

CivicBridge is currently an academic full-stack prototype.

- The application uses JSON file storage rather than a production-grade database.
- The application is not integrated with official municipal government systems.
- Map tiles require an internet connection.
- Automatic GPS capture depends on browser permissions.
- Priority assessment uses predefined rules rather than AI.
- Escalation indicators do not automatically send external notifications.
- Monthly reports require the backend scheduler to run.
- Demonstration complaints and photographs are illustrative.
- Production scalability and concurrent data access require further engineering.
- Uploaded sample photographs must have appropriate usage permissions before public deployment.

---

# 🔮 Future Enhancements

CivicBridge can be further extended into a comprehensive smart-city infrastructure management ecosystem.

### 🤖 Artificial Intelligence

- AI-based infrastructure damage classification.
- Automatic image-based complaint categorization.
- Infrastructure damage severity estimation.
- Predictive maintenance analytics.
- Intelligent duplicate image detection.

### 📱 Mobile Application

- Dedicated Android and iOS applications.
- Mobile push notifications.
- Simplified camera-based complaint reporting.
- Offline complaint drafting.

### 🗄️ Advanced Database Integration

- PostgreSQL or MongoDB integration.
- Improved concurrent data handling.
- Database indexing and query optimization.
- Cloud-based image storage.
- Automated backups.

### 🔔 Real-Time Communication

- Live complaint status updates.
- Email and SMS notifications.
- Automated escalation notifications.
- Real-time departmental alerts.

### 🌍 Accessibility and Inclusion

- Multilingual interface.
- Regional language support.
- Voice-based complaint reporting.
- Enhanced accessibility features.

### 🏙️ Smart City Integration

- Integration with municipal government systems.
- IoT-based infrastructure monitoring.
- Smart garbage bin monitoring.
- Automated water leakage detection.
- Ward-wise infrastructure management.
- Predictive infrastructure maintenance planning.

### 📈 Advanced Analytics

- Infrastructure trend forecasting.
- Departmental workload prediction.
- Geographic complaint hotspot analysis.
- Interactive administrative analytics.
- Long-term infrastructure performance evaluation.

---

# 🌱 Sustainable Development Goals

CivicBridge aligns conceptually with several United Nations Sustainable Development Goals.

| SDG | Contribution |
|---|---|
| 🏗️ SDG 9 – Industry, Innovation and Infrastructure | Encourages technology-driven infrastructure management. |
| 🏙️ SDG 11 – Sustainable Cities and Communities | Supports safer, cleaner and more sustainable urban environments. |
| ⚖️ SDG 16 – Peace, Justice and Strong Institutions | Promotes transparency, accountability and responsive public services. |
| 🤝 SDG 17 – Partnerships for the Goals | Encourages collaboration between citizens and public authorities. |

---

# 👩‍💻 Developer Information

| Information | Details |
|---|---|
| Project Title | CivicBridge – Smart Civic Issue Reporting & Management System |
| Developed By | R. Aashritha |
| Student ID | 2403A51084 |
| Batch | 3 |
| Subject | SESD |
| Department | Computer Science & Artificial Intelligence |
| University | SR University |
| Project Type | Full-Stack Web Application |
| Academic Year | 2026–2027 |

---

# 👨‍🏫 Faculty Guidance

**Dr. C Madan Kumar**

Associate Professor  
Department of Computer Science & Artificial Intelligence  
SR University

---

# 🙏 Acknowledgements

Special thanks to Dr. C Madan Kumar, Associate Professor, Department of Computer Science & Artificial Intelligence, SR University, for academic guidance and support throughout the development of this project.

Acknowledgement is also extended to the open-source communities behind React, Node.js, Express.js, Leaflet, OpenStreetMap, Tailwind CSS and other technologies used in CivicBridge.

---

# 📷 Sample Data and Image Disclaimer

The demonstration complaints included in CivicBridge are intended for academic presentation and functionality testing.

Sample photographs and geographical locations should not be interpreted as verified evidence of actual infrastructure complaints.

Map data and tiles are provided by OpenStreetMap contributors.

The application does not submit complaints to real government departments.

---

# 📜 Project Usage

CivicBridge has been developed as an academic software engineering project for educational, demonstration and learning purposes.

Appropriate software licensing, image permissions, security configuration and production infrastructure should be established before public distribution or commercial deployment.

---

# 💙 Conclusion

CivicBridge demonstrates how modern web technologies can improve civic engagement and public infrastructure management.

By integrating complaint reporting, geographical visualization, departmental coordination, community support, repair verification, gamification and automated performance reporting into a single platform, CivicBridge provides a comprehensive approach to addressing urban infrastructure challenges.

The project emphasizes transparency, accountability, accessibility and active citizen participation.

CivicBridge represents a step towards building digitally connected, citizen-centered and sustainable cities.

---

### 🌉 CivicBridge

**Report. Connect. Resolve. Transform.**

🏙️ Better Infrastructure. Stronger Communities. Smarter Cities.

⭐ If you find this project interesting, consider starring the repository!
