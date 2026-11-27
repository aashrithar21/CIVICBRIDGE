# CivicBridge
Connecting Citizens. Improving Cities.

## Run on Windows
Install Node.js 22.16 or newer (prefer current Node 22 LTS or 24 LTS). Extract the ZIP, open the CivicBridge folder in VS Code, and open two PowerShell terminals.

Terminal 1:
```powershell
cd backend
npm ci
npm run dev
```
Terminal 2 (from project root):
```powershell
cd frontend
npm ci
npm run dev -- --port 5173 --strictPort
```
Open http://localhost:5173. Backend health: http://localhost:5000/api/health.

## Demo accounts (local use only)
Citizens and departments sign in through **separate portals**: `/login` (citizens) and `/department/login` (staff and admin). A department account must be signed in under its own department; the wrong department, or the wrong portal, is rejected.

**Citizen portal** (`/login`)

| Email | Password |
|---|---|
| citizen1@civicbridge.test | Civic@12345 |
| citizen2@civicbridge.test | Citizen2@12345 |

**Department portal** (`/department/login`: pick the department, then sign in)

| Department | Email | Password |
|---|---|---|
| Public Works Department | staff@civicbridge.test | Staff@12345 |
| Sanitation Department | staff.sanitation@civicbridge.test | Staff@12345 |
| Water Supply Department | staff.water@civicbridge.test | Staff@12345 |
| Electrical Department | staff.electrical@civicbridge.test | Staff@12345 |
| Drainage Department | staff.drainage@civicbridge.test | Staff@12345 |
| General Administration | staff.general@civicbridge.test | Staff@12345 |
| City Administration (admin) | admin@civicbridge.test | Admin@12345 |

Staff only see and update complaints routed to their own department; admins see all. Create more department accounts with `node scripts/createUser.js "Name" "email" "password" staff "Sanitation Department"` (or `admin` with no department).

Register a new citizen or use a demo account. Report an issue, optionally upload an image and capture GPS, explore reports, support another citizen's report, and update its status as staff/admin. The public dashboard uses actual stored data. The city map displays the selected report using OpenStreetMap; internet access is required for map tiles. GPS requires browser permission.

## Storage and configuration
JSON files in backend/data and images in backend/uploads. No database installation. A fresh local JWT secret is supplied in backend/.env; rotate before deployment. Demo accounts and original sample reports are retained. Do not expose this local demo publicly. Dependencies are installed using the supplied lockfiles; node_modules and stale dist output are excluded.

## Verification
Frontend application TypeScript check passed using TypeScript 5.8.3 against supplied dependency types. Backend HTTP smoke tests passed for registration, login, session, photo upload, report creation, listing, detail, duplicate detection, role enforcement, staff/admin status changes and support. The full Vite build and browser visual tests could not be run in the Linux verification environment because the uploaded dependencies were Windows-specific and package downloads were unavailable. Run `npm run build` in frontend after installing dependencies on Windows.

## Sample photographs
The two demo reports use user-supplied illustrative photographs, not verified evidence from their listed locations. Original source pages: https://commons.wikimedia.org/wiki/File:Potholes_on_road.jpg and https://commons.wikimedia.org/wiki/File:Damaged_public_street_light,_Feijenoord,_Rotterdam_(2021)_05.jpg . Consult those pages for author and license details.

## Expanded demo
12 reports total: 3 resolved, 3 in progress, 6 ongoing (submitted, under review or assigned). Ten new reports are fictional examples with approximate map locations and no photographs; the original two photos remain. Explore supports category/status filters, sorting, reset and browser-local saved reports. Details include link copying and map links. Transparency includes department resolution rates. Previous verification notes apply to the earlier version; see current verification below.

Current upgrade verification: frontend TypeScript application check passed with TypeScript 5.8.3 and original dependency types; all 12 records have unique IDs and existing image paths. Full Vite build and browser testing not performed.

### Advanced map and design update
Every seeded complaint has illustrative GPS coordinates. The city map uses locally bundled Leaflet with OpenStreetMap online tiles, all filtered pins, status colors, and report links. New reports require GPS or a manually chosen pin. Sample images are illustrative, not verified evidence; missing photographs remain honestly marked. Feature inspiration: https://fixmystreet.org/training/citizens/ and https://fixmystreet.org/running/staff/ . This demo does not send reports to government systems.

## Resolution upgrade
Sample photos are illustrative, not verified location evidence. User-provided stock previews retain their watermarks; obtain appropriate licenses before public deployment. Priority is a rule-based category/support/age score, not AI. Overdue (7 days) and escalation due (14 days) are computed indicators, not automatic notifications. Map density uses overlapping 350 m circles. Staff can upload repair proof on issue details; reporting citizens can verify/rate or reopen resolved reports. No fabricated after-repair photos are included.

## Civic Impact Score
Citizens earn points and achievement badges for useful contributions (`/citizen/impact`, with a summary card on the citizen dashboard). The score is calculated from stored complaint data each time, so it always matches the real records.

| Activity | Points |
|---|---|
| Report submitted (not rejected) | +10 |
| Report includes a photo | +5 |
| Report resolved | +20 |
| Repair verified and rated by you | +10 |
| Supporting a neighbour's report | +3 (first 20 count) |
| Each supporter on your report | +2 (first 5 per report count) |

Levels: Newcomer (0), Contributor (25), Active Citizen (75), Community Champion (150), City Guardian (300). Eight badges: First Report, Neighbourhood Watch, Photo Witness, All-Rounder, Community Voice, Crowd Favourite, Problem Solver, Repair Verifier. The leaderboard shows first name + initial only. API: `GET /api/impact/me`, `GET /api/impact/leaderboard` (citizens only).

## Automated monthly civic reports
Staff and admins get a monthly infrastructure performance report (`/staff/reports`, `/admin/reports`): reports received/resolved, resolution rate, average days to resolve, share resolved within the 7-day target, open/overdue/escalated backlog, department performance with a rating, category breakdown, citizen repair ratings, comparison with the previous month, and auto-written highlights. Print/save as PDF and CSV download are built in.

* **Automatic:** when the backend starts, and every 6 hours after, it generates and stores (in `backend/data/monthly-reports.json`) a report for every finished month that does not have one yet. Months missed while the server was off are filled in on the next start. The current month is always shown live as "month to date".
* **Scope:** staff see only their own department; admins see the whole city or filter by department, and can regenerate a finished month.
* **Definitions:** resolution rate = resolved ÷ (open at start of month + received). Status at month end is rebuilt from each complaint's timestamped history. Rating is rule-based: Good at 70%+ with no escalations, Needs attention under 40% or with any escalation due, otherwise Fair. Months follow UTC.
* All 12 demo reports were created in November 2026, so only the current month has data until a new month begins. API: `GET /api/reports/monthly`, `GET /api/reports/monthly/:month?department=`, `POST /api/reports/monthly/:month/regenerate` (admin).

Verification for this update: all new/changed frontend files pass a TypeScript syntax check, and the Civic Impact Score and monthly report calculations were run against the demo data. The full backend API, `npm run build` and browser testing were not run (dependencies could not be installed in the verification environment). Run `npm ci` in both folders and `npm run build` in `frontend`.
