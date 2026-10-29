# FYP-Event-Management-System
Final Year Project - Event Management and Vendor Booking System


A full-stack web platform that connects customers with event vendors. Customers can browse, book, and pay for events, vendors manage their own listings and bookings through a dedicated portal, and admins oversee the whole system from a dashboard.

## Live Preview

**Frontend (Vercel):** https://event-management-and-vendor-booking.vercel.app

> **Note:** This is a frontend-only preview. The backend is not hosted yet, so signup, login, and booking will not work on the live link. To use the complete system, run the project locally by following the [Getting Started](#getting-started) steps below.

## Screenshots and Demo

Add your screenshots to a `screenshots/` folder in the repo and link them here:

| Customer Home | Event Details | Vendor Portal | Admin Dashboard |
|---|---|---|---|
| ![Home](screenshots/home.png) | ![Event](screenshots/event.png) | ![Vendor](screenshots/vendor.png) | ![Admin](screenshots/admin.png) |

**Demo video:** add your YouTube or LinkedIn link here

## Features

**Customer website**
- Register, log in, and manage an account
- Browse and search events by category
- Book events and pay online (PayPal)
- Leave reviews on events
- Message vendors directly (real-time chat)

**Vendor portal**
- Register as a vendor and wait for admin approval
- Create event listings with photos and pricing
- Manage incoming bookings and orders
- Respond to customer bids

**Admin dashboard**
- Sales and activity analytics with charts
- Approve or reject vendor registrations
- Manage all events and users

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend (customer site and vendor portal) | React 18, React Router, React-Bootstrap / Bootstrap, Axios |
| Backend | Node.js, Express |
| Database | SQLite with Sequelize ORM (`backend/database.sqlite`) |
| Authentication | JSON Web Tokens (JWT), bcrypt password hashing |
| Real-time | Socket.IO |
| Payments | PayPal (sandbox) |
| File uploads | Multer |
| Charts | react-google-charts |

## Project Structure

```
├── backend/     Express API, Sequelize models, routes, SQLite database
├── frontend/    Customer-facing React app (port 3000)
├── vendor/      Vendor portal React app (port 3001)
├── SETUP_GUIDE.txt        Detailed step-by-step setup (Windows)
└── SQLITE_MIGRATION.md    Notes on the MongoDB to SQLite migration
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version)

### 1. Clone the repository
```bash
git clone https://github.com/jibran11jb/Event-Management-And-Vendor-Booking-System.git
cd Event-Management-And-Vendor-Booking-System
```

### 2. Configure the backend
Create a file named `.env` inside the `backend` folder:
```
PORT=5000
JWT_SECRET=change_this_to_your_own_secret
PAYPAL_CLIENT_ID=sb
```

### 3. Install dependencies
```bash
cd backend && npm install && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..
cd vendor && npm install --legacy-peer-deps && cd ..
```

### 4. Run the project
Open three terminals, one per part. Start the backend first.

```bash
# Terminal 1: backend  (http://localhost:5000)
cd backend
npm start

# Terminal 2: customer website  (http://localhost:3000)
cd frontend
npm start

# Terminal 3: vendor portal  (http://localhost:3001)
cd vendor
npm start
```

### 5. Load demo data (first run only)
With the backend running, open `http://localhost:5000/api/seed` in your browser to create sample events and admin accounts. Admin login details are listed in `SETUP_GUIDE.txt`.

For a detailed walkthrough and troubleshooting tips, see [SETUP_GUIDE.txt](SETUP_GUIDE.txt).

## Author

**Jibran**
BS Computer Science, COMSATS University Islamabad (Abbottabad Campus)
GitHub: [jibran11jb](https://github.com/jibran11jb)
LinkedIn: [Jibran Najeeb](https://www.linkedin.com/in/jibran-najeeb-a0219234a)
