# IkkatBazaar - Complete Setup Instructions

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB Atlas** account - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary** account - [Sign up](https://cloudinary.com/)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Create a database user with username and password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Add your IP address to the IP whitelist

## Step 2: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/) and sign up
2. Go to Dashboard and note down:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Clone/Download Project

```bash
# If using git
git clone <repository-url>
cd ikkat-bazaar

# Or extract if downloaded as zip
cd ikkat-bazaar
```

## Step 4: Backend Setup

### 4.1 Install Dependencies
```bash
cd backend
npm install
```

### 4.2 Create Environment File
```bash
cp .env.example .env
```

### 4.3 Configure Environment Variables
Edit `backend/.env` and add your credentials:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/ikkat-bazaar
JWT_SECRET=your_super_secret_key_change_this_in_production
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### 4.4 Start Backend Server
```bash
# From backend directory
npm start
```

You should see:
```
MongoDB connected
Server running on port 5000
```

**Verify it's working**: Visit `http://localhost:5000/api/health`

## Step 5: Frontend Setup

### 5.1 Install Dependencies
```bash
cd frontend
npm install
```

### 5.2 Create Environment File
```bash
cp .env.example .env
```

### 5.3 Configure Environment Variables
Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 5.4 Start Frontend Server
```bash
# From frontend directory
npm start
```

The app will automatically open at `http://localhost:3000`

## Step 6: Test the Application

### 6.1 Create Test Accounts

**Customer Account:**
1. Go to Register page
2. Fill in details:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Role: Customer
3. Click Register

**Artisan Account:**
1. Go to Register page
2. Fill in details:
   - Name: Priya Singh
   - Email: priya@example.com
   - Password: password123
   - Role: Artisan
   - Phone: 9876543210
3. Click Register

**Admin Account:**
You'll need to manually set role to 'admin' in MongoDB:
1. Go to MongoDB Atlas
2. Navigate to Collections
3. Find Users collection
4. Create/Update a user with role: "admin"

### 6.2 Test Basic Workflows

**Customer Workflow:**
- [ ] Register as customer
- [ ] View products on home page
- [ ] Search and filter products
- [ ] Add product to cart
- [ ] Proceed to checkout
- [ ] Place order
- [ ] View order history in profile

**Artisan Workflow:**
- [ ] Register as artisan
- [ ] Complete artisan profile
- [ ] Submit for verification (wait for admin)
- [ ] Create products
- [ ] View sales dashboard

**Admin Workflow:**
- [ ] Login as admin
- [ ] View pending artisan verifications
- [ ] Approve/reject artisan
- [ ] View all orders
- [ ] View platform statistics

## Step 7: Development Tips

### Running with Nodemon (Backend)
```bash
cd backend
npm run dev
```

### Backend API Testing
Use Postman or curl to test endpoints:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### Debugging Frontend
- Use React Developer Tools browser extension
- Check Console tab for errors
- Use Redux DevTools (if Redux is integrated)

### Debugging Backend
- Check server logs in terminal
- Use MongoDB Compass to inspect database
- Use Postman for API testing

## Step 8: Deployment Preparation

### Before Deploying:

1. **Update Environment Variables**
   - Create `.env` on production servers
   - Never commit `.env` to git
   - Use environment-specific secrets

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```
   This creates a `build/` folder ready for deployment

3. **Prepare Backend**
   - Ensure all dependencies are in package.json
   - Test all endpoints
   - Set NODE_ENV to 'production'

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import repository
4. Set environment variables
5. Deploy

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [Render](https://render.com/)
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

## Troubleshooting

### Issue: MongoDB Connection Error
```
Solution: Check MONGODB_URI in .env
- Ensure password is URL-encoded
- Check IP whitelist in MongoDB Atlas
- Test connection string
```

### Issue: Cloudinary Integration Failing
```
Solution: Verify credentials
- Check CLOUDINARY_NAME, API_KEY, API_SECRET
- Test with curl:
  curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
```

### Issue: CORS Error
```
Solution: Backend CORS configuration
- Ensure frontend URL is in CORS whitelist
- Check browser console for exact error
- Verify axios headers
```

### Issue: JWT Token Not Working
```
Solution: 
- Ensure JWT_SECRET is set correctly
- Check token is properly stored in localStorage
- Verify Authorization header format: "Bearer <token>"
```

### Issue: Products Not Showing
```
Solution:
- Check if products exist in MongoDB
- Verify artisan is verified before uploading
- Check product isActive flag
```

## File Structure Reference

```
ikkat-bazaar/
├── backend/
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── public/          # Static files
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── store/       # State management
    │   ├── styles/      # CSS files
    │   ├── App.js
    │   └── index.js
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── .gitignore
```

## Next Steps

1. **Explore the codebase** - Read through files to understand structure
2. **Add features** - Implement payment gateway, notifications
3. **Create tests** - Add unit and integration tests
4. **Deploy** - Push to Vercel and Render
5. **Monitor** - Use monitoring tools in production

## Support

For issues:
1. Check existing issues in repository
2. Read error messages carefully
3. Check environment variables
4. Test API endpoints with Postman
5. Create detailed issue report with logs

## Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand State Management](https://github.com/pmndrs/zustand)

---

**You're all set! Start developing IkkatBazaar! 🚀**