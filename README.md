# Hotel Rajdhani Palace MERN Application

Hotel Rajdhani Palace is a full-stack hotel booking platform built with the MERN stack for a college assignment. It includes JWT authentication, guest booking management, admin controls for bookings and rooms, and a responsive React frontend styled with Tailwind CSS.

## Tech Stack

- MongoDB with Mongoose
- Express.js and Node.js REST API
- React.js with Vite
- Context API for authentication state
- Axios for API communication
- Tailwind CSS for styling

## Folder Structure

```bash
client/   # React frontend
server/   # Express backend
```

## Features

- JWT-based signup/login with bcrypt password hashing
- Protected routes with `user` and `admin` role handling
- Room listing and room management CRUD
- Booking CRUD with owner-level access control
- Admin dashboard for hotel-wide booking oversight
- Booking conflict checks to prevent overlapping reservations
- Seed script with three dummy rooms
- Deployment-ready setup for Render and Vercel

## Local Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

Copy the examples below and create real `.env` files.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell you can use:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

### 3. Start MongoDB

Make sure MongoDB is running locally or replace `MONGODB_URI` with your MongoDB Atlas connection string.

### 4. Seed sample rooms

```bash
npm run seed
```

### 5. Run the application

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Default Admin

When the backend starts for the first time, it auto-creates an admin account from the backend environment file:

- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Rooms

- `GET /api/rooms`
- `POST /api/rooms` admin only
- `PUT /api/rooms/:id` admin only
- `DELETE /api/rooms/:id` admin only

### Bookings

- `GET /api/bookings/my`
- `POST /api/bookings`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`
- `GET /api/bookings/all` admin only

## Deployment

### Render Backend

The repo includes [`render.yaml`](C:\Users\jadha\OneDrive\Documents\rajdhani\render.yaml), so Render can auto-detect the backend service settings.

1. In Render, create a new Blueprint or Web Service from this GitHub repo.
2. If using the manual flow, set root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `server/.env.example`.
6. Set `CLIENT_URL` to your deployed Vercel frontend URL.
7. Use MongoDB Atlas for `MONGODB_URI` in production.

### Vercel Frontend

The frontend includes [`client/vercel.json`](C:\Users\jadha\OneDrive\Documents\rajdhani\client\vercel.json) so React routes work correctly after deployment.

1. Import the repository into Vercel.
2. Set the root directory to `client`.
3. Framework preset: `Vite`.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add `VITE_API_BASE_URL` and point it to your Render backend, for example `https://your-backend.onrender.com/api`.
7. Deploy.

## Production Checklist

1. Deploy MongoDB Atlas and copy the connection string into Render as `MONGODB_URI`.
2. Deploy the backend on Render and copy the live URL.
3. Deploy the frontend on Vercel with `VITE_API_BASE_URL` set to `https://your-render-service.onrender.com/api`.
4. Update Render `CLIENT_URL` to your final Vercel URL so CORS accepts the frontend.
5. Log in with the admin email from Render environment settings after the backend starts.

## Important Notes

- The booking form calculates price based on room rate and number of nights.
- Users can only update or delete their own bookings.
- Admins can manage all bookings and all rooms.
- Room availability and overlapping date checks are enforced on the server.

## Submission Tips

- Seed data before recording your demo so room cards appear immediately.
- Log in once as an admin and once as a normal user to demonstrate both dashboards.
- Replace the default admin password before real-world deployment.
