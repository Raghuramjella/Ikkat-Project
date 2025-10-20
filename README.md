# IkkatBazaar - Handloom E-commerce Platform

A full-stack web application that empowers handloom artisans by connecting them directly with global customers.

## 🎯 Project Overview

IkkatBazaar is a marketplace platform built with modern web technologies to:
- Enable artisans to showcase and sell handloom products
- Provide customers with access to authentic handloom items
- Ensure trust through artisan verification
- Facilitate secure transactions

## 🏗️ Architecture

### Frontend
- **Framework**: React.js 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **File Storage**: Cloudinary
- **Validation**: Express Validator

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📁 Project Structure

```
ikkat-bazaar/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Artisan.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── artisan.routes.js
│   │   ├── customer.routes.js
│   │   ├── products.routes.js
│   │   └── orders.routes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── client.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── Footer.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Products.js
    │   │   ├── ProductDetail.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── CustomerProfile.js
    │   │   ├── ArtisanDashboard.js
    │   │   ├── AdminDashboard.js
    │   │   └── NotFound.js
    │   ├── store/
    │   │   ├── authStore.js
    │   │   └── cartStore.js
    │   ├── styles/
    │   │   └── index.css
    │   ├── App.js
    │   └── index.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ikkat-bazaar
JWT_SECRET=your_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

5. Start the server:
```bash
npm start
```
Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

5. Start the development server:
```bash
npm start
```
App will open at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin
- `POST /api/admin/artisans/:id/verify` - Verify artisan
- `GET /api/admin/artisans/pending` - Get pending artisans
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id` - Update order status
- `GET /api/admin/statistics` - Get platform statistics

### Artisan
- `POST /api/artisan/profile` - Create/update artisan profile
- `GET /api/artisan/profile` - Get artisan profile
- `GET /api/artisan/sales/summary` - Get sales summary

### Customer
- `GET /api/customer/profile` - Get customer profile
- `PUT /api/customer/profile` - Update customer profile
- `GET /api/customer/orders` - Get customer orders

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (artisan only)
- `PUT /api/products/:id` - Update product (artisan only)
- `DELETE /api/products/:id` - Delete product (artisan only)
- `POST /api/products/:id/review` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/cancel` - Cancel order

## 👥 User Roles

### Customer
- Browse and search products
- Add products to cart
- Place orders
- Track order history
- Leave reviews

### Artisan
- Create and manage profile
- Upload and manage products
- View sales and revenue
- Track orders
- Receive customer reviews

### Admin
- Verify artisans
- Manage products and orders
- Handle disputes
- View platform statistics
- Monitor platform health

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Secure Cloudinary integration

## 📦 Key Features Implemented

### Phase 1: Artisan Onboarding ✅
- User registration and login
- Artisan profile creation
- Admin verification process
- JWT token management

### Phase 2: Product & Listing ✅
- Product upload functionality
- Inventory management
- Product search and filtering
- Category-based browsing

### Phase 3: Customer Journey ✅
- Shopping cart functionality
- Product reviews and ratings
- Order placement
- Order tracking

### Phase 4: Payment & Communication 🔄
- Payment method selection (Razorpay, Bank Transfer, COD)
- Order status updates
- WhatsApp integration (ready for implementation)

### Phase 5: Deployment & Demo 🔄
- Deployment configuration
- Demo preparation

## 🛠️ Technologies & Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: Authentication
- cors: Cross-origin requests
- cloudinary: Image storage
- dotenv: Environment configuration

### Frontend
- react: UI library
- react-router-dom: Client-side routing
- axios: HTTP requests
- zustand: State management
- tailwindcss: Styling
- react-icons: Icon components

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🧪 Testing

### Backend Testing
```bash
npm test
```

### Frontend Testing
```bash
npm test
```

## 📈 Performance Optimization

- Lazy loading of components
- Image optimization via Cloudinary
- Database indexing for fast queries
- API response pagination
- Caching strategies

## 🐛 Known Issues & Future Enhancements

- Implement Razorpay payment integration
- Add WhatsApp notification system
- Email verification for users
- Advanced analytics dashboard
- Multi-language support
- Mobile app version

## 📞 Support & Contribution

For issues or feature requests, please create an issue in the repository.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

This project celebrates and supports traditional Indian handloom artisans by providing them a digital marketplace to showcase and sell their authentic products.

---

**IkkatBazaar: Weaving a brighter future for handloom** 🪡