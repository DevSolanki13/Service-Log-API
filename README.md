# TrackMyServices 🚗🏍️

> Track Your Vehicle Maintenance With Precision & Ease.

TrackMyServices is a full-stack vehicle service and maintenance log application designed to help vehicle owners keep track of maintenance records, expenses, and upcoming service schedules. It features a modern, clean dashboard and intuitive tracking tools.

Live Demo: **[service-log-api.vercel.app](https://service-log-api.vercel.app/)**

---

## 📸 Screenshots

| Landing Page | Dashboard |
|---|---|
| ![Landing Page](assets/landing-page.png) | ![Dashboard](assets/dashboard.png) |

*(To view these screenshots in your repository, create an `assets/` folder in the root and save your screenshot images as `landing-page.png` and `dashboard.png` respectively).*

---

## ✨ Features

- **Separate Multi-Vehicle Management**: Register and manage multiple vehicles (Jeeps, Tesla, Yamahas, etc.) with dedicated service logs for each.
- **Detailed Cost Breakdown**: Track individual part replacement costs, labor, and total maintenance expenses across all registered vehicles.
- **Maintenance Reminders**: Get auto-calculated upcoming service indicators (e.g., "Brake Pad Replacement in 6 days") based on target service dates.
- **One-Click Demo Mode**: Try out the full app and view a populated dashboard instantly without registration.
- **Secure Authentication**: User sign-up, sign-in, and session management using JWT.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Modern, responsive custom CSS with clean UI/UX and visual charts
- **API Client**: Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security**: JWT Authentication, CORS, Helmet, xss-clean, express-rate-limit

### Infrastructure & Deployment
- **Platform**: [Vercel](https://vercel.com/) (using the unified `services` monorepo configuration)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB account and database connection string

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DevSolanki13/Service-Log-API.git
   cd Service-Log-API
   ```

2. **Configure Backend Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Open `backend/.env` and update the values with your database credentials and secret keys:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_LIFETIME=30d
   PORT=5000
   ```

3. **Install Dependencies and Run Locally:**

   **For Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

   **For Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create a new user account
- `POST /api/v1/auth/login` - Authenticate and get JWT token

### Vehicles
- `GET /api/v1/vehicles` - Fetch all user-registered vehicles
- `POST /api/v1/vehicles` - Add a new vehicle
- `DELETE /api/v1/vehicles/:id` - Delete a vehicle

### Service Logs (Authenticated)
- `GET /api/v1/services` - Get service logs
- `POST /api/v1/services` - Add a service record
- `DELETE /api/v1/services/:id` - Delete a service record

---

## 📄 License

This project is licensed under the ISC License.
