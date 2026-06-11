# growth-agency-backend API Documentation

This document provides a systematic guide for the frontend team to integrate with the Express backend APIs. It covers all endpoints defined in the Postman collection.

## ── Base URLs ──
* **Local Development**: `http://localhost:5001/api`
* **Production Deployment**: `https://growth-agency-backend.onrender.com/api`

---

## 1. Authentication (Google OAuth 2.0)

The backend uses a secure, stateless JWT-based session model. Authenticated client requests must provide the token in one of two ways:
1. In the **`access_token`** secure cookie (automatically managed by the browser).
2. In the **`Authorization: Bearer <JWT_TOKEN>`** header (ideal for Postman or mobile clients).

### A. Initiate Google Login
* **URL**: `/auth/google`
* **Method**: `GET`
* **Action**: Redirect your user's browser directly to this endpoint. The browser will redirect to Google's consent screen.

### B. OAuth Callback (Internal)
* **URL**: `/auth/google/callback`
* **Method**: `GET`
* **Action**: Google redirects back to this URI with the authorization code. The backend exchanges it, saves the `access_token` cookie in the user's browser, and redirects the user to:
  * Local Development: `http://localhost:3000/dashboard`
  * Production: `${CLIENT_URL}/dashboard`

### C. Get Current User Session (Profile)
* **URL**: `/auth/me`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>` (if cookie is not used)
* **Response (200 OK)**:
  ```json
  {
    "id": "clz123456789...",
    "email": "user@example.com",
    "name": "Jane Doe",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
  ```

### D. Logout User
* **URL**: `/auth/logout`
* **Method**: `POST`
* **Response (200 OK)**:
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

---

## 2. Public Contact Form
Allows website visitors to submit inquiry contact forms.

* **URL**: `/contact`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+919999999999",
    "subject": "General Inquiry",
    "message": "I would like to inquire about customized Enterprise plans for my organization."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": "clzcontact123...",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+919999999999",
    "subject": "General Inquiry",
    "message": "I would like to inquire about...",
    "status": "NEW",
    "createdAt": "2026-06-04T10:48:02.000Z"
  }
  ```

---

## 3. User Onboarding
Saves onboarding response details for the logged-in user. Requires user authentication.

* **URL**: `/onboarding`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "companyName": "Acme Builders Ltd",
    "phone": "+919876543210",
    "email": "contact@acmebuilders.com",
    "address": "123 Business Park, Mumbai",
    "country": "India",
    "useCase": "Contract Management & Billing",
    "teamSize": "10-50",
    "goals": "Automate rental agreements and tracking",
    "industry": "Construction & Real Estate",
    "aboutBusiness": "We build premium residential apartments in Western India.",
    "brandColors": "#FF5733, #33FF57",
    "referenceWebsites": "https://example.com, https://competitor.com",
    "socialMediaLinks": "https://linkedin.com/company/acmebuilders",
    "pagesNeeded": "5",
    "servicesProducts": "Construction, Interior Design",
    "competitors": "BuildCorp Ltd",
    "instagramFacebookAccess": "Granted",
    "existingHandles": "@acmebuilders",
    "targetLocation": "Mumbai, Pune",
    "targetAudience": "Home Buyers",
    "budget": "₹50,000"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "message": "Onboarding completed successfully",
    "onboarding": {
      "id": "clz88888...",
      "userId": "clz12345...",
      "companyName": "Acme Builders Ltd",
      "isComplete": true,
      "createdAt": "2026-06-04T10:48:02.000Z",
      "updatedAt": "2026-06-04T10:48:02.000Z"
    }
  }
  ```

---

## 4. Subscription Plans (Public View)

### A. List Active Plans
* **URL**: `/plans`
* **Method**: `GET`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": "plan_starter_id...",
      "name": "Starter Presence",
      "price": 199900,
      "currency": "INR",
      "billingCycle": "MONTHLY",
      "features": ["website:5-page-informative", "social-media:2-posts-weekly"],
      "razorpayPlanId": "plan_LHN123xxx"
    }
  ]
  ```
  *Note: Prices are in **paise** (₹1999.00 = 199900).*

### B. Get Plan By ID
* **URL**: `/plans/:id`
* **Method**: `GET`
* **Response (200 OK)**: Returns the plan details object.

---

## 5. Payments & Subscriptions (Razorpay)

### A. Create Razorpay Subscription
* **URL**: `/payment/subscribe`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "planId": "plan_starter_id..."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "subscriptionId": "sub_LHN789xxx",
    "shortUrl": "https://rzp.io/i/abcdefg",
    "status": "created",
    "localSubscription": {
      "id": "local_sub_id...",
      "userId": "user_id...",
      "planId": "plan_starter_id...",
      "status": "PENDING",
      "razorpaySubscriptionId": "sub_LHN789xxx"
    }
  }
  ```
  *Action: Open the `shortUrl` in the browser to trigger Razorpay's checkout client.*

### B. Verify Subscription Signature
* **URL**: `/payment/verify`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "razorpayPaymentId": "pay_KJS123...",
    "razorpaySubscriptionId": "sub_LHN789...",
    "razorpaySignature": "823abcefg..."
  }
  ```
* **Response (200 OK)**: Returns updated active local subscription and invoice payment record.

### C. Cancel Active Subscription
* **URL**: `/payment/cancel`
* **Method**: `POST`
* **Response (200 OK)**: Returns subscription details with state updated to `CANCELLED`.

---

## 6. Customer Dashboard Details

### A. Get User Profile & Onboarding Response
* **URL**: `/user/me`
* **Method**: `GET`
* **Response (200 OK)**: Returns user info nested with `onboarding` values.

### B. Get Active Subscription Details
* **URL**: `/user/subscription`
* **Method**: `GET`

### C. Get Payments History List
* **URL**: `/user/payments`
* **Method**: `GET`

---

## 7. Admin Console APIs

All admin endpoints require the bearer token in the **`Authorization: Bearer <ADMIN_JWT_TOKEN>`** header.

### A. Admin Account Login
* **URL**: `/admin/auth/login`
* **Method**: `POST`
* **Request Body**: `{"adminId": "super_admin_001", "password": "Admin@123"}`
* **Response (200 OK)**: `{"access_token": "eyJhbG..."}`

### B. Get Dashboard Aggregated Stats
* **URL**: `/admin/stats`
* **Method**: `GET`

### C. Get Registered Users (Paginated & Filterable)
* **URL**: `/admin/users`
* **Method**: `GET`
* **Query Parameters**: `page` (default 1), `limit` (default 10), `search` (optional)

### D. Get User Details
* **URL**: `/admin/users/:id`
* **Method**: `GET`

### E. Toggle User Active Status (Block/Unblock)
* **URL**: `/admin/users/:id/status`
* **Method**: `PATCH`
* **Request Body**: `{"isActive": false}`

### F. Get Invoices & Payments History
* **URL**: `/admin/payments`
* **Method**: `GET`
* **Query Parameters**: `status` (optional, e.g. `PAID`)

### G. Staff Admin Accounts Management

#### 1. Get Staff List
* **URL**: `/admin/admins`
* **Method**: `GET`

#### 2. Create Staff Admin (SUPER_ADMIN only)
* **URL**: `/admin/admins`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "adminId": "staff_002",
    "password": "Temp@1234",
    "name": "Jane Doe",
    "role": "STAFF",
    "permissions": ["contacts:read", "users:read"]
  }
  ```

#### 3. Update Staff Admin Details (SUPER_ADMIN only)
* **URL**: `/admin/admins/:id`
* **Method**: `PATCH`
* **Request Body**: `{"name": "Jane Doe Updated", "permissions": ["contacts:read", "users:read"]}`

#### 4. Deactivate Staff Admin (SUPER_ADMIN only)
* **URL**: `/admin/admins/:id`
* **Method**: `DELETE`

### H. Contact Form Submissions Management

#### 1. Get Contact Submissions List
* **URL**: `/admin/contacts`
* **Method**: `GET`
* **Query Parameters**: `status` (optional, e.g. `NEW`)

#### 2. Get Single Contact Submission
* **URL**: `/admin/contacts/:id`
* **Method**: `GET`

#### 3. Update Contact Status & Notes
* **URL**: `/admin/contacts/:id`
* **Method**: `PATCH`
* **Request Body**: `{"status": "IN_PROGRESS", "adminNote": "Sent proposal email."}`

#### 4. Delete Contact Submission
* **URL**: `/admin/contacts/:id`
* **Method**: `DELETE`

### I. Subscription Plan Management (Console)

#### 1. Get All Plans
* **URL**: `/admin/plans`
* **Method**: `GET`

#### 2. Create Plan
* **URL**: `/admin/plans`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "name": "Pro Yearly Premium",
    "price": 999900,
    "currency": "INR",
    "billingCycle": "YEARLY",
    "features": ["dashboard:view", "reports:advanced"]
  }
  ```

#### 3. Update Plan Features
* **URL**: `/admin/plans/:id`
* **Method**: `PATCH`
* **Request Body**: `{"price": 1099900, "features": ["dashboard:view", "reports:advanced"]}`

#### 4. Soft Delete Plan
* **URL**: `/admin/plans/:id`
* **Method**: `DELETE`
