# IkkatBazaar Architecture Documentation

## System Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│  (React App)    │
│ Vercel Deploy   │
└────────┬────────┘
         │ HTTPS
         │ Axios API Calls
         │
┌────────▼─────────────────────────────────────────┐
│         API Gateway / CORS Handler              │
└────────┬────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────┐
│     Backend Server (Express.js)                 │
│     Render Deployment                           │
├──────────────────────────────────────────────────┤
│ Routes:                                         │
│  ├─ /auth        (Login/Register)              │
│  ├─ /admin       (Admin Functions)             │
│  ├─ /artisan     (Artisan Functions)           │
│  ├─ /customer    (Customer Functions)          │
│  ├─ /products    (Product Management)          │
│  └─ /orders      (Order Management)            │
└────────┬────────────────────────────────────────┘
         │ Mongoose ORM
         │ Connection Pool
         │
┌────────▼─────────────────────────────────────────┐
│     MongoDB Atlas (Cloud Database)              │
├──────────────────────────────────────────────────┤
│ Collections:                                    │
│  ├─ users       (Authentication)               │
│  ├─ artisans    (Artisan Profiles)            │
│  ├─ products    (Product Catalog)             │
│  ├─ orders      (Order Management)            │
│  └─ reviews     (Product Reviews)             │
└──────────────────────────────────────────────────┘

         External Services
              │
     ┌────────┼────────┐
     │        │        │
┌────▼───┐ ┌─▼──────┐ ┌▼──────────┐
│Cloudinary│Razorpay│ │  WhatsApp  │
│  Images  │ Payment│ │ (Future)   │
└──────────┘ └───────┘ └───────────┘
```

## Data Flow Architecture

### 1. Authentication Flow

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │ POST /auth/register
       │ {email, password, name, role}
       │
┌──────▼───────────────────────┐
│  Backend - Auth Controller   │
├──────────────────────────────┤
│ 1. Validate Input            │
│ 2. Check Existing Email      │
│ 3. Hash Password (bcrypt)    │
│ 4. Create User Record        │
└──────┬──────────────────────┘
       │
       ▼
    ┌─────────────┐
    │  MongoDB    │
    │ Users Coll. │
    └─────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Generate JWT Token           │
│ Return {user, token}         │
└──────┬──────────────────────┘
       │
       ▼
   ┌─────────────────────┐
   │ Frontend            │
   │ Save: localStorage  │
   │ token & user info   │
   └─────────────────────┘
```

### 2. Product Upload Flow

```
┌──────────────────┐
│  Artisan         │
│  (Authenticated) │
└────────┬─────────┘
         │ POST /products
         │ {name, price, images, inventory}
         │
┌────────▼──────────────────────────┐
│ Backend - Product Controller      │
├───────────────────────────────────┤
│ 1. Verify JWT Token               │
│ 2. Verify User Role = 'artisan'   │
│ 3. Get Artisan Record             │
│ 4. Verify Artisan Status = 'verified'
└────────┬──────────────────────────┘
         │
         ├─ Upload Images
         │  │
         │  └──→ Cloudinary API
         │       └─ Returns: image_urls
         │
         ├─ Create Product Record
         │  └──→ MongoDB
         │
         └─ Update Artisan totalProducts++
```

### 3. Order Processing Flow

```
┌──────────────────┐
│  Customer        │
│  (Authenticated) │
└────────┬─────────┘
         │ POST /orders
         │ {items[], shippingAddress, paymentMethod}
         │
┌────────▼──────────────────────────┐
│ Backend - Order Controller        │
├───────────────────────────────────┤
│ 1. Verify JWT Token               │
│ 2. Fetch Product Details for Each Item
│ 3. Calculate:                     │
│    - Subtotal                     │
│    - Tax (18% GST)                │
│    - Final Amount                 │
└────────┬──────────────────────────┘
         │
         ├─ Create Order Record
         │  └──→ MongoDB
         │
         ├─ Update Inventory
         │  └──→ Product Collection
         │
         ├─ Process Payment (if online)
         │  └──→ Razorpay API (Future)
         │
         └─ Return Order Confirmation
            └──→ Frontend
```

## Database Schema Architecture

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['admin', 'artisan', 'customer'],
  isVerified: Boolean,
  verifiedAt: Date,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Artisan Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  businessName: String,
  yearsOfExperience: Number,
  specialties: [String],
  bio: String,
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  verificationStatus: Enum ['pending', 'verified', 'rejected'],
  verificationNotes: String,
  verifiedBy: ObjectId,
  totalProducts: Number,
  totalSales: Number,
  rating: Number,
  reviews: [{
    customerId: ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }]
}
```

### Product Schema
```javascript
{
  _id: ObjectId,
  artisanId: ObjectId (ref: Artisan),
  name: String,
  description: String,
  category: Enum [sarees, dupattas, fabrics, clothing, accessories, home-decor],
  price: Number,
  discount: Number,
  finalPrice: Number (calculated),
  images: [String] (Cloudinary URLs),
  inventory: {
    quantity: Number,
    unit: String
  },
  details: {
    material: String,
    color: String,
    size: String,
    careInstructions: String
  },
  isActive: Boolean,
  rating: Number,
  reviews: [{...}],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    artisanId: ObjectId,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  discount: Number,
  tax: Number,
  finalAmount: Number,
  shippingAddress: {...},
  paymentMethod: Enum ['razorpay', 'bank-transfer', 'cod'],
  paymentStatus: Enum ['pending', 'completed', 'failed'],
  orderStatus: Enum ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  createdAt: Date,
  updatedAt: Date
}
```

## API Architecture

### Middleware Stack

```
Request
   │
   ▼
┌─────────────────────────┐
│ Express Middleware      │
├─────────────────────────┤
│ 1. CORS Handler         │
│ 2. JSON Parser          │
│ 3. URL Encoder          │
│ 4. Async Error Handler  │
│ 5. Route Handler        │
└────────┬────────────────┘
         │
    ┌────▼────────────────────┐
    │ Route-Specific Handlers │
    ├────────────────────────────┤
    │ 1. Auth Middleware       │
    │ 2. Role Middleware       │
    │ 3. Validation Middleware │
    │ 4. Business Logic        │
    └────┬────────────────────┘
         │
         ▼
    Database
```

### Request/Response Pattern

```
Request:
{
  headers: {
    "Authorization": "Bearer <jwt_token>",
    "Content-Type": "application/json"
  },
  body: { ... }
}

Response (Success):
{
  status: 200,
  data: { ... },
  message: "Success"
}

Response (Error):
{
  status: 400/401/403/500,
  message: "Error description",
  error: { ... }
}
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   ├── Cart Icon
│   └── User Menu
│
├── Main Routes
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Features
│   │   └── CTA
│   ├── Products
│   │   ├── Filter Section
│   │   ├── ProductCard (multiple)
│   │   └── Pagination
│   ├── ProductDetail
│   │   ├── Image Gallery
│   │   ├── ProductInfo
│   │   ├── ReviewsSection
│   │   └── ArtisanInfo
│   ├── Auth (Login/Register)
│   ├── Cart
│   │   ├── CartItems
│   │   └── OrderSummary
│   ├── Checkout
│   │   ├── ShippingForm
│   │   ├── PaymentMethod
│   │   └── Summary
│   ├── UserDashboards
│   │   ├── CustomerProfile
│   │   ├── ArtisanDashboard
│   │   └── AdminDashboard
│   └── NotFound
│
└── Footer
    ├── Links
    ├── Categories
    └── Social Media
```

### State Management (Zustand)

```
Global Stores:
├── authStore
│   ├── user (object)
│   ├── token (string)
│   ├── setAuth (function)
│   └── logout (function)
│
└── cartStore
    ├── cart (array)
    ├── addToCart (function)
    ├── removeFromCart (function)
    ├── updateQuantity (function)
    └── clearCart (function)
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Validate Credentials    │
│ - Email exists?         │
│ - Password matches?     │
└────────┬────────────────┘
         │
    ┌────▼─────────┐
    │ Valid?       │
    └─────────────┬─────────────┐
                  │             │
            ┌─────▼────┐   ┌────▼────┐
            │   Yes    │   │   No    │
            └─────┬────┘   └────┬────┘
                  │             │
            ┌─────▼──────┐      │
            │Generate JWT│      │
            │ (7 day exp)│      │
            └─────┬──────┘      │
                  │             │
         ┌────────▼──┬──────────▼────┐
         │ Return    │ Return Error   │
         │ Token     │ 401            │
         └───────────┴────────────────┘
```

### Role-Based Access Control

```
Endpoint: POST /api/artisan/profile

┌──────────────────────────┐
│ Extract JWT Token        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Verify Token Valid       │
│ (Signature, Expiry)      │
└────────┬─────────────────┘
         │
    ┌────▼────────────┐
    │ Valid?          │
    └─┬───────────────┬──┐
      │ No            │  │
      │               │  │ Yes
      │          ┌────▼────────────────┐
      │          │ Check User Role     │
      │          │ (from JWT payload)  │
      │          └────┬───────────────┘
      │               │
      │          ┌────▼──────────┐
      │          │ Role==artisan?│
      │          └────┬─────────┬─┘
      │               │         │
      │          ┌────▼────┐  ┌─▼──┐
      │          │ Yes    │  │ No │
      │          └────┬───┘  └──┬─┘
      │               │         │
  ┌───▼──┐ ┌─────────▼┐  ┌────▼──┐
  │Error │ │Execute   │  │Error  │
  │401   │ │Handler   │  │403    │
  └──────┘ └──────────┘  └───────┘
```

## Scalability Considerations

### Horizontal Scaling

```
Frontend Scaling:
├─ Static assets → CDN (Cloudinary)
├─ Multiple frontend instances → Load balancer
└─ Caching strategies

Backend Scaling:
├─ Multiple server instances → Load balancer
├─ Session management → Shared store
├─ Database connections → Connection pooling
└─ Caching layer → Redis (future)

Database Scaling:
├─ Read replicas for queries
├─ Indexing on frequently queried fields
├─ Sharding for large collections
└─ Backup strategies
```

## Monitoring & Logging

```
Frontend Monitoring:
├─ Error tracking (Sentry)
├─ Performance monitoring (Google Analytics)
└─ User analytics

Backend Monitoring:
├─ Server logs (Winston/Morgan)
├─ Database performance
├─ API response times
└─ Error tracking
```

---

This architecture supports current requirements and allows for easy scaling and feature additions.