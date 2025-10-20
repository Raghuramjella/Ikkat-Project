# IkkatBazaar - Quick Start Guide ⚡

Get IkkatBazaar running in 5 minutes!

## 📋 Prerequisites Checklist

- [ ] Node.js installed (`node --version` to verify)
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created
- [ ] Terminal/Command prompt ready

## 🚀 Quick Setup (5 Steps)

### Step 1: Get Your Credentials (2 min)

**MongoDB Atlas:**
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string: `mongodb+srv://...`

**Cloudinary:**
1. Log in to [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Note: Cloud Name, API Key, API Secret

### Step 2: Backend Setup (1.5 min)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials (use any text editor)
# PORT=5000
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=mysecretkey123
# CLOUDINARY_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...

# Start server
npm start
```

✅ You should see: `Server running on port 5000`

### Step 3: Frontend Setup (1.5 min)

```bash
# Navigate to frontend (open new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start app
npm start
```

✅ App opens at `http://localhost:3000`

## ✅ Verify Everything Works

1. **Backend Health:** Visit `http://localhost:5000/api/health`
   - Should show: `{"status":"Server is running"}`

2. **Frontend:** Visit `http://localhost:3000`
   - Should show: IkkatBazaar homepage

3. **Test Registration:**
   - Go to Register page
   - Create a new account
   - Try logging in

## 🧪 Quick Test Scenarios

### Scenario 1: Create a Customer Account
```
Name: John Doe
Email: john@example.com
Password: password123
Role: Customer
```
✅ Should redirect to home page after login

### Scenario 2: View Products
```
1. Click "Products" in navbar
2. See list of products (might be empty initially)
3. Try searching/filtering
```

### Scenario 3: Shopping Cart
```
1. Click a product (if any exist)
2. Click "Add to Cart"
3. Click shopping cart icon
4. Verify item in cart
```

## 📁 Project Structure at a Glance

```
ikkat-bazaar/
├── backend/              # Express.js API server
│   ├── routes/          # API endpoints
│   ├── models/          # MongoDB schemas
│   ├── server.js        # Main server
│   └── package.json
│
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   └── App.js       # Main app
│   └── package.json
│
└── Documentation files
    ├── README.md
    ├── SETUP_INSTRUCTIONS.md
    ├── ARCHITECTURE.md
    └── QUICK_START.md (this file)
```

## 🔧 Common Commands

### Backend Commands
```bash
cd backend

# Start server
npm start

# Start with auto-reload
npm run dev

# Install new package
npm install package-name
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🆘 Troubleshooting Quick Fixes

### Backend won't start
```
❌ Error: Cannot connect to MongoDB
✅ Fix: Check MONGODB_URI in .env file
```

### Port already in use
```
❌ Error: EADDRINUSE: address already in use
✅ Fix: Kill process or change PORT in .env
```

### Frontend won't load API
```
❌ Error: Failed to fetch from API
✅ Fix: Make sure backend is running on port 5000
```

### Image upload fails
```
❌ Error: Cloudinary error
✅ Fix: Verify CLOUDINARY_* credentials in .env
```

## 📚 Next Steps

After getting it running:

1. **Explore the code** - Read through key files
2. **Create test data** - Add products, orders
3. **Learn the flow** - Follow a complete shopping journey
4. **Add features** - Implement payment gateway, emails
5. **Deploy** - Push to Vercel/Render

## 🎯 Key Features to Try

- ✅ User Registration/Login
- ✅ Product Browsing
- ✅ Shopping Cart
- ✅ Order Checkout
- ✅ Customer Dashboard
- ✅ Artisan Dashboard
- ✅ Admin Dashboard
- ⏳ Payment Integration (future)
- ⏳ WhatsApp Notifications (future)

## 📞 Need Help?

1. Check error messages in terminal
2. Review SETUP_INSTRUCTIONS.md for detailed steps
3. Check MongoDB/Cloudinary credentials
4. Verify both backend and frontend are running
5. Check browser console for frontend errors

## 🎉 You're Ready!

You now have a fully functional IkkatBazaar development environment!

**Happy Coding!** 🚀

---

For detailed setup: See `SETUP_INSTRUCTIONS.md`
For architecture: See `ARCHITECTURE.md`
For full docs: See `README.md`