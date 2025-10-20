# Admin Module - Quick Start Guide 🚀

Get started with the Admin Module in 5 minutes!

---

## 🔓 Step 1: Login to Admin Panel

**URL:** `http://localhost:3000/admin/login`

**Credentials:**
```
Email: admin@ikkatbazaar.com
Password: admin123456
```

---

## 📊 Step 2: Admin Dashboard

After login, you'll see the **Admin Dashboard** with:

```
┌─────────────────────────────────────────────────────┐
│           Admin Dashboard Overview                   │
├─────────────────────────────────────────────────────┤
│  Total Users: 45      │  Verified Artisans: 12     │
│  Pending Artisans: 3  │  Total Orders: 127         │
│  Total Revenue: ₹2,50,000                           │
├─────────────────────────────────────────────────────┤
│  ▶ Manage Products     │  ▶ Verify Artisans         │
│  ▶ Manage Orders       │  ▶ View Reports (soon)     │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Module 1: Manage Products

**URL:** `http://localhost:3000/admin/products`

### Quick Actions:
- 📋 **View**: See all products in a table
- 🔍 **Filter**: By Active/Inactive status
- ✏️ **Edit**: Modify product details
- 👁️ **Toggle**: Activate/Deactivate products
- 🗑️ **Delete**: Remove products permanently

### Example:
```
1. Click "Manage Products" on dashboard
2. See table with: Product Name | Artisan | Price | Category | Status
3. Click pencil icon to edit a product
4. Change price and click "Save"
5. Product updated!
```

---

## 👥 Module 2: Verify Artisans

**URL:** `http://localhost:3000/admin/artisans`

### Quick Actions:
- 👤 **View**: See pending artisan applications
- 🔍 **Filter**: By Pending/Verified/Rejected
- ✅ **Verify**: Approve artisan to start selling
- ❌ **Reject**: Decline application with reason
- 📝 **Notes**: Add verification notes

### Example:
```
1. Click "Verify Artisans" on dashboard
2. Filter by "Pending"
3. Review artisan: Business name, experience, docs
4. Add notes: "Documents verified. Approved."
5. Click "Verify" → Artisan can now sell!
```

---

## 🛒 Module 3: Manage Orders

**URL:** `http://localhost:3000/admin/orders`

### Quick Actions:
- 📊 **View**: All orders with details
- ⚙️ **Update Status**: Placed → Confirmed → Shipped → Delivered
- 📈 **Analytics**: See order summary statistics
- 💳 **Track**: Payment method and status

### Example:
```
1. Click "Manage Orders" on dashboard
2. Find order: "123abc... | Customer: Priya | ₹2,500"
3. Click pencil icon
4. Select: "Shipped" from dropdown
5. Click "Save" → Customer is notified!
```

---

## 💳 Module 4: UPI Payment (Razorpay)

### Setup (One-time):

**Step 1:** Go to https://razorpay.com and create account

**Step 2:** Get API keys from Settings → API Keys

**Step 3:** Update `backend/.env`:
```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Step 4:** Restart backend

### How It Works:

```
Customer → Checkout → Select UPI → 
Razorpay Opens → Customer Pays → 
Payment Verified → Order Confirmed → 
Admin Can Track
```

### Test Payment:
- Card: `4111 1111 1111 1111`
- Month/Year: Any future date
- CVV: Any 3 digits

---

## 📁 File Structure

```
Frontend Pages Created:
├── AdminLogin.js          (Admin login page)
├── AdminDashboard.js      (Dashboard with stats)
├── AdminProducts.js       (Product management)
├── AdminArtisans.js       (Artisan verification)
└── AdminOrders.js         (Order management)

Backend Routes Updated:
├── admin.routes.js        (ALL admin endpoints)
└── orders.routes.js       (UPI payment endpoints)

Models Updated:
├── Product.js             (Already has status)
├── Artisan.js             (Already has verification)
└── Order.js               (Payment support)
```

---

## 🔑 Important API Endpoints

### Admin Login
```bash
POST /api/admin/login
Body: { email, password }
Returns: { token }
```

### Product Management
```bash
GET    /api/admin/products              # View all
PUT    /api/admin/products/:id          # Edit
PATCH  /api/admin/products/:id/toggle   # Activate/Deactivate
DELETE /api/admin/products/:id          # Delete
```

### Artisan Verification
```bash
GET  /api/admin/artisans              # View all
POST /api/admin/artisans/:id/verify   # Verify/Reject
```

### Order Management
```bash
GET   /api/admin/orders              # View all
PATCH /api/admin/orders/:id          # Update status
GET   /api/admin/statistics          # Get dashboard stats
```

### UPI Payment
```bash
POST /api/orders/:id/payment/create    # Create payment
POST /api/orders/:id/payment/verify    # Verify payment
GET  /api/orders/payment/razorpay-key  # Get public key
```

---

## 🎯 Common Tasks

### Change Admin Password
1. Edit `backend/.env`
2. Change: `ADMIN_PASSWORD=new_password_here`
3. Restart backend
4. Login with new password

### Add Razorpay Keys
1. Get keys from Razorpay dashboard
2. Edit `backend/.env`
3. Add: `RAZORPAY_KEY_ID=...` and `RAZORPAY_KEY_SECRET=...`
4. Restart backend

### Verify an Artisan
1. Go to `/admin/artisans`
2. Filter by "Pending"
3. Click artisan card
4. Add optional notes
5. Click "Verify"

### Update Order Status
1. Go to `/admin/orders`
2. Find order
3. Click edit (pencil)
4. Select new status
5. Click "Save"

---

## ✨ Features Summary

| Feature | Module | Status |
|---------|--------|--------|
| Product CRUD | Products | ✅ Complete |
| Product Toggle | Products | ✅ Complete |
| Artisan Verification | Artisans | ✅ Complete |
| Rejection with Notes | Artisans | ✅ Complete |
| Order Status Update | Orders | ✅ Complete |
| UPI Payment | Payment | ✅ Complete |
| Dashboard Stats | Dashboard | ✅ Complete |
| Admin Login | Auth | ✅ Complete |
| Permission Check | Auth | ✅ Complete |

---

## 🆘 Quick Troubleshoot

| Problem | Solution |
|---------|----------|
| Admin login fails | Check credentials in `.env`, restart backend |
| UPI payment not working | Verify Razorpay keys in `.env` |
| Products not showing | Create products as artisan first |
| Session expires | Token expires after 24h, login again |
| Features not loading | Check browser console for errors, check backend logs |

---

## 📞 Need Help?

1. **Check:** `ADMIN_MODULE_SETUP.md` for detailed guide
2. **Review:** `backend/.env` configuration
3. **Debug:** Check browser console (F12)
4. **Logs:** Check backend terminal output
5. **Contact:** Development team

---

## 🚀 You're All Set!

**Next Steps:**
1. ✅ Configure Razorpay keys
2. ✅ Test admin login
3. ✅ Try managing products
4. ✅ Verify test artisans
5. ✅ Track orders
6. ✅ Test UPI payment

**Enjoy your Admin Panel!** 🎉

---

**Last Updated:** 2024
**Version:** 1.0 Admin Module Complete