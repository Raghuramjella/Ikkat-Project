# Repository Guide

## Project Snapshot
- **Name**: IkkatBazaar — Handloom e-commerce marketplace
- **Stack**: MERN (MongoDB, Express, React, Node.js) with Cloudinary for media storage
- **Purpose**: Connect artisans with customers, managing products, orders, and roles (admin/artisan/customer)

## High-Level Layout
```
ikkat-bazaar/
├── backend/        # Express REST API + MongoDB models
└── frontend/       # React SPA with Tailwind styling
```

## Backend Highlights (`backend/`)
- **Entry Point**: `server.js`
- **Config**: `config/db.js` (MongoDB), `config/cloudinary.js`
- **Auth**: JWT middleware in `middleware/auth.js`
- **Data Models**: `models/User.js`, `Artisan.js`, `Product.js`, `Order.js`
- **Routes**:
  - **auth.routes.js**: registration, login, OTP/reset flows, profile image upload
  - **artisan.routes.js**: artisan profile + sales
  - **products.routes.js**: CRUD for products, filtering, reviews
  - **orders.routes.js**: order creation & updates
  - **customer.routes.js**: customer profile & orders
  - **admin.routes.js**: artisan verification, platform stats
- **Scripts**: `npm start` (production), `npm run dev` (with nodemon if configured)
- **Env Vars** (sample): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `NODE_ENV`

## Frontend Highlights (`frontend/`)
- **Entry Point**: `src/index.js`
- **Main App**: `src/App.js` with React Router v6
- **State**: Zustand stores under `src/store/`
- **API Layer**: `src/api/client.js` (Axios instance)
- **Pages**: Home, Products, ProductDetail, Auth, Cart, Checkout, Dashboards, etc.
- **Styling**: Tailwind (`tailwind.config.js`, `postcss.config.js`)
- **Scripts**: `npm start`, `npm run build`, `npm test`
- **Env Vars**: `REACT_APP_API_URL`, `REACT_APP_ENV`

## Setup Cheatsheet
1. **Backend**
   - `Set-Location "c:\Users\raghu\OneDrive\Desktop\mini\ikkat-bazaar\backend"`
   - `npm install`
   - Copy `.env.example` → `.env`, fill credentials
   - `npm start` (defaults to `http://localhost:5000`)
2. **Frontend**
   - `Set-Location "c:\Users\raghu\OneDrive\Desktop\mini\ikkat-bazaar\frontend"`
   - `npm install`
   - Copy `.env.example` → `.env`, adjust API URL
   - `npm start` (served at `http://localhost:3000`)

## Testing & Common Tasks
- **Backend tests**: `npm test` inside `backend/`
- **Frontend tests**: `npm test` inside `frontend/`
- **Lint/format**: none configured explicitly; follow project conventions (Prettier not detected)

## Useful References
- `README.md`: comprehensive project overview and feature list
- `ARCHITECTURE.md`, `FILE_STRUCTURE.md`: extended documentation

Keep this guide handy for quick context when working with the repo.