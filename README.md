Perfect 👍 Now that you’ve shared your **dependencies list**, I’ll update the `README.md` **Features section** so it reflects the actual tech stack and capabilities supported by your backend.

Here’s the **improved README.md** 👇

---

```markdown
# BondhuChol Tour Management System (Backend)

This is the backend service for **BondhuChol Tour Management System**, built with Node.js, Express, and MongoDB.  
It provides RESTful APIs for managing tours, bookings, users, authentication, payments, and more.  

🚀 The backend is deployed at:  
**[https://bondhucoltmsbackend.vercel.app](https://bondhucoltmsbackend.vercel.app)**

---

## 📌 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Local strategy authentication with Passport.js
  - Google OAuth 2.0 login
  - Role-based access control (Admin, User, etc.)

- **Tour & Booking Management**
  - CRUD operations for tours
  - Booking creation & management
  - File/image uploads for tours using **Multer + Cloudinary**

- **User Management**
  - Secure password hashing with **bcryptjs**
  - Session management with **express-session** & cookies
  - Input validation with **Zod**

- **Payment & Documents**
  - Payment integration-ready (SSLCommerz / Stripe can be added)
  - PDF generation for invoices & tickets with **PDFKit**

- **Email & Notifications**
  - Email sending with **Nodemailer**
  - Redis caching for session/token management

- **Other Utilities**
  - API testing with Postman (`BondhuChol Tour Management.json`)
  - CORS enabled for frontend integration
  - Axios for external API calls
  - EJS template engine support for server-side rendering (optional)

---

## 📂 Repository Structure
```

├── controllers/       # Business logic
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Authentication & validation
├── utils/             # Helper functions (cloudinary, pdf, etc.)
├── BondhuChol Tour Management.json  # Postman API collection
└── README.md

````

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/BondhuChol-TMS-Backend.git
cd BondhuChol-TMS-Backend
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory and configure it:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDIS_URL=your_redis_url
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4️⃣ Run Locally

```bash
npm run dev
```

Server will start at `http://localhost:5000`

---

## 🧪 API Testing with Postman

1. Import the file **`BondhuChol Tour Management.json`** into Postman.

   * Open Postman → Import → Upload the JSON file.
2. All endpoints will be available in a collection named **BondhuChol Tour Management**.
3. Update the base URL in Postman to:

   ```
   https://bondhucoltmsbackend.vercel.app
   ```
4. Run the requests and test APIs directly.

---

## 🌐 Live API Base URL

```
https://bondhucoltmsbackend.vercel.app
```

Example endpoints:

* `GET /api/v1/tours` → Fetch all tours
* `POST /api/v1/bookings` → Create a booking
* `POST /api/v1/auth/login` → User login
* `POST /api/v1/auth/google` → Google OAuth login

---

