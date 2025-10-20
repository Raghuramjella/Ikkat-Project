# Admin Module Setup Guide - IkkatBazaar

Complete guide for setting up and using the Admin Module with product management, artisan verification, order management, and UPI payment integration via Razorpay.

## 📋 Table of Contents

1. [Admin Credentials](#admin-credentials)
2. [Razorpay UPI Payment Setup](#razorpay-upi-payment-setup)
3. [Admin Features Overview](#admin-features-overview)
4. [How to Access Admin Panel](#how-to-access-admin-panel)
5. [Admin Dashboard Features](#admin-dashboard-features)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Testing Guide](#testing-guide)

---

## 🔐 Admin Credentials

### Default Credentials

```
Email: admin@ikkatbazaar.com
Password: admin123456
```

### Change Admin Credentials

To change admin credentials, edit `.env` file in the backend:

```env
ADMIN_EMAIL=your_new_email@example.com
ADMIN_PASSWORD=your_new_password
```

**Note:** Restart the backend server after changing credentials.

---

## 💳 Razorpay UPI Payment Setup

### 1. Create Razorpay Account

1. Go to: **https://razorpay.com**
2. Click "Sign Up"
3. Fill in your business details
4. Complete KYC verification (email + phone)
5. Once verified, access your Dashboard

### 2. Get Razorpay API Keys

1. Login to Razorpay Dashboard
2. Navigate to: **Settings → API Keys**
3. You'll see two keys:
   - **Key ID** (public key) - starts with `rzp_live_`
   - **Key Secret** (private key) - keep this secret!
4. Copy both keys

### 3. Configure in Backend

Update `backend/.env` file:

```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 4. Test Razorpay

1. Restart backend: `npm start`
2. Go to Razorpay Dashboard → Settings → Webhooks
3. Keep it ready for production deployment
4. For testing, use test mode in Razorpay dashboard

---

## 🎯 Admin Features Overview

### 1. **Product Management**
   - View all products
   - Filter by status (active/inactive) and category
   - Edit product details (name, price, discount, etc.)
   - Toggle product active/inactive status
   - Delete products
   - View artisan information for each product

### 2. **Artisan Verification**
   - View all artisans with their profiles
   - Filter by verification status (pending/verified/rejected)
   - Review artisan documents and details
   - Add verification notes
   - Approve or reject artisan applications
   - View artisan specialties, experience, and ratings

### 3. **Order Management**
   - View all orders in the system
   - See customer details and payment information
   - Update order status (placed → confirmed → shipped → delivered)
   - Track order creation date
   - View payment method and status
   - Monitor order summaries

### 4. **Dashboard Analytics**
   - Total users count
   - Verified artisans count
   - Pending artisans awaiting verification
   - Total orders
   - Total revenue generated

---

## 🔑 How to Access Admin Panel

### Step 1: Go to Admin Login

```
http://localhost:3000/admin/login
```

### Step 2: Enter Credentials

```
Email: admin@ikkatbazaar.com
Password: admin123456
```

### Step 3: You'll Be Redirected to Admin Dashboard

The dashboard shows overview statistics and quick links to all admin modules.

---

## 📊 Admin Dashboard Features

### Dashboard Homepage

```
Route: /admin/dashboard
```

**Features:**
- 📊 Platform statistics (users, artisans, orders, revenue)
- 🔄 Quick navigation to all admin modules
- 📈 Dashboard cards with key metrics
- 🚪 Logout button in top-right

### Statistics Shown

| Metric | Description |
|--------|-------------|
| **Total Users** | All registered users (customers + artisans) |
| **Verified Artisans** | Artisans approved by admin |
| **Pending Artisans** | Artisans awaiting verification |
| **Total Orders** | All orders placed on platform |
| **Total Revenue** | Sum of all completed orders |

---

## 📦 Product Management

### Access Products Page

```
Route: /admin/products
```

### Features

1. **View All Products**
   - See all products listed in a table
   - View: Product name, artisan, price, category, status
   - Pagination support (can be added)

2. **Filter Products**
   - **All Products** - View all
   - **Active** - Only active listings
   - **Inactive** - Deactivated products

3. **Edit Product**
   - Click edit icon (pencil) next to any product
   - Update: name, description, price, discount, category
   - Save changes

4. **Deactivate/Activate**
   - Click eye icon to toggle status
   - Inactive products won't show in customer search
   - Reactivate anytime without re-entering data

5. **Delete Product**
   - Click trash icon to permanently delete
   - Confirm deletion
   - Cannot be undone

### Example Workflow

```
1. Go to /admin/products
2. See all products in table format
3. Filter by "Inactive" to see disabled products
4. Click edit (pencil) to modify a product
5. Change price: 500 → 450
6. Click Save
7. Product is updated immediately
```

---

## 👥 Artisan Verification

### Access Artisans Page

```
Route: /admin/artisans
```

### Features

1. **View All Artisans**
   - See business name, owner name, email, phone
   - View experience, specialties, products, rating
   - Read bio/description

2. **Filter by Status**
   - **All** - All artisans
   - **Pending** - Not yet verified
   - **Verified** - Approved artisans
   - **Rejected** - Denied artisans

3. **Verify Artisan**
   - For pending artisans only
   - Review details (documents, bio, experience)
   - Add verification notes (optional)
   - Click "Verify" to approve
   - Once verified:
     - Can upload products
     - Can receive orders
     - Appears in artisan search

4. **Reject Artisan**
   - For pending artisans only
   - Add notes explaining rejection reason
   - Click "Reject"
   - Artisan notified of rejection
   - Can reapply with improvements

### Example Workflow

```
1. Go to /admin/artisans
2. Filter by "Pending"
3. Review artisan details:
   - Business name: "Silk Dreams Studio"
   - Experience: 5 years
   - Specialties: Silk sarees, traditional weaving
   - Documents uploaded
4. Add notes: "Verified documents. Good experience. Approved."
5. Click "Verify"
6. Status changes to "VERIFIED"
7. Artisan can now sell
```

---

## 🛒 Order Management

### Access Orders Page

```
Route: /admin/orders
```

### Features

1. **View All Orders**
   - Order ID (last 8 digits shown)
   - Customer name and email
   - Order amount
   - Payment method (Razorpay, UPI, Bank Transfer, COD)
   - Payment status
   - Order status
   - Creation date

2. **Update Order Status**
   - Click edit (pencil) icon on any order
   - Select new status from dropdown:
     - **Placed** - Order just created
     - **Confirmed** - Payment verified
     - **Shipped** - Sent to delivery
     - **Delivered** - Reached customer
     - **Cancelled** - Order cancelled
   - Click "Save"
   - Status updates immediately

3. **Order Summary Statistics**
   - Total Orders count
   - Delivered orders
   - Shipped orders
   - Pending orders
   - Cancelled orders

### Payment Methods Supported

| Method | Description |
|--------|-------------|
| **Razorpay** | Credit/Debit cards via Razorpay |
| **UPI** | Unified Payments Interface |
| **Bank Transfer** | Direct bank transfer |
| **COD** | Cash on Delivery |

### Example Workflow

```
1. Go to /admin/orders
2. See list of all orders
3. Find order with ID ending in "a1b2c3d4"
4. Customer: "Priya Kumar"
5. Amount: ₹2,500
6. Current Status: "Placed"
7. Click edit icon
8. Select status: "Confirmed" (payment verified)
9. Click Save
10. Order status updated to "Confirmed"
11. Later, update to "Shipped" when package is sent
12. Finally, update to "Delivered" when reached customer
```

---

## 🔌 API Endpoints Reference

### Admin Authentication

**POST** `/api/admin/login`
```json
Request:
{
  "email": "admin@ikkatbazaar.com",
  "password": "admin123456"
}

Response:
{
  "message": "Admin login successful",
  "token": "jwt_token_here"
}
```

### Product Management

**GET** `/api/admin/products`
- Parameters: `status`, `category`, `artisanId`
- Returns: All products with filters

**GET** `/api/admin/products/:productId`
- Returns: Single product details

**PUT** `/api/admin/products/:productId`
- Updates: name, description, price, discount, category

**PATCH** `/api/admin/products/:productId/toggle`
- Toggles: active/inactive status

**DELETE** `/api/admin/products/:productId`
- Deletes: product permanently

### Artisan Management

**GET** `/api/admin/artisans`
- Parameters: `status` (all, pending, verified, rejected)
- Returns: All artisans

**POST** `/api/admin/artisans/:artisanId/verify`
```json
Request:
{
  "status": "verified",
  "verificationNotes": "Documents verified. Approved for selling."
}
```

### Order Management

**GET** `/api/admin/orders`
- Returns: All orders

**PATCH** `/api/admin/orders/:orderId`
```json
Request:
{
  "orderStatus": "shipped"
}
```

**GET** `/api/admin/statistics`
- Returns: Dashboard statistics

### UPI Payment (Razorpay)

**POST** `/api/orders/:orderId/payment/create`
- Creates Razorpay order
- Returns: razorpayOrderId, amount

**POST** `/api/orders/:orderId/payment/verify`
- Verifies payment signature
- Updates order status to confirmed

**GET** `/api/orders/payment/razorpay-key`
- Returns: Razorpay public key

---

## 🧪 Testing Guide

### Test Admin Login

1. Go to `http://localhost:3000/admin/login`
2. Enter:
   - Email: `admin@ikkatbazaar.com`
   - Password: `admin123456`
3. Click Login
4. Should redirect to `/admin/dashboard`

### Test Product Management

1. Go to `/admin/products`
2. Try filtering by "Active" and "Inactive"
3. Click edit on a product
4. Change price from 500 to 450
5. Save and verify change
6. Try deactivating a product (eye icon)
7. Verify it moves to "Inactive" filter

### Test Artisan Verification

1. Go to `/admin/artisans`
2. Filter by "Pending"
3. Review an artisan
4. Add notes: "Good documents, approved"
5. Click "Verify"
6. Check if status changed to "VERIFIED"

### Test Order Management

1. Create an order as customer
2. Go to `/admin/orders`
3. Find your order
4. Click edit icon
5. Change status to "Confirmed"
6. Save
7. Verify status changed

### Test UPI Payment

1. Create an order with product
2. Go to checkout
3. Select "UPI / Razorpay" as payment method
4. Click "Proceed to Payment"
5. Razorpay window should open
6. Use test card (in test mode): `4111 1111 1111 1111`
7. Any future date and any CVV
8. Payment should complete
9. Admin can see "Payment Status: Completed"

---

## ⚙️ Configuration

### Environment Variables

**Backend `.env` File:**

```env
# Admin Configuration
ADMIN_EMAIL=admin@ikkatbazaar.com
ADMIN_PASSWORD=admin123456

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxx

# Other configs
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## 🚀 Deployment Checklist

- [ ] Change admin credentials to secure values
- [ ] Get production Razorpay keys (not test keys)
- [ ] Update Razorpay keys in .env
- [ ] Enable HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Set strong JWT_SECRET
- [ ] Configure email for notifications
- [ ] Test all admin features in production
- [ ] Set up monitoring/logging
- [ ] Create admin backup procedures

---

## 🆘 Troubleshooting

### Admin Login Not Working

**Problem:** Login fails with invalid credentials error
**Solution:**
1. Check `.env` has correct `ADMIN_EMAIL` and `ADMIN_PASSWORD`
2. Restart backend server
3. Clear browser cache
4. Try again

### Razorpay Payment Not Working

**Problem:** Payment window doesn't open or payment fails
**Solution:**
1. Verify Razorpay keys are correct in `.env`
2. Check if in test mode (use test credentials)
3. Ensure Razorpay account is verified
4. Check browser console for errors
5. Restart backend server

### Products Not Showing

**Problem:** Admin products page shows empty
**Solution:**
1. Create some products as artisan first
2. Make sure artisan is verified
3. Verify products are active
4. Check MongoDB connection

### Token Expired

**Problem:** Session expires and you're logged out
**Solution:**
1. JWT tokens expire after 24 hours
2. Login again to get new token
3. Consider implementing refresh token logic

---

## 📱 Features Roadmap

**Planned Features:**
- [ ] Export orders to CSV/Excel
- [ ] Admin notifications
- [ ] Refund management
- [ ] Discount coupon management
- [ ] User role management (multiple admins)
- [ ] Advanced analytics and reports
- [ ] Email notifications to artisans/customers
- [ ] Bulk product operations
- [ ] Commission management

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check backend logs
4. Contact development team

---

**Last Updated:** 2024
**Version:** 1.0