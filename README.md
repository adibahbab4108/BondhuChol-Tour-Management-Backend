# BondhuChol Tour Management System (Backend)

This is the backend service for **BondhuChol Tour Management System**, built with Node.js, Express, and MongoDB.  
It provides RESTful APIs for managing tours, bookings, users, authentication, payments, and more.  

🚀 The backend is deployed at:  
**[https://bondhucoltmsbackend.vercel.app](https://bondhucoltmsbackend.vercel.app)**

### The project follows modular MVC pattern for scalability

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


## ⚙️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/adibahbab4108/BondhuChol-Tour-Management-Backend.git
cd BondhuChol-TMS-Backend
```
### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and copy all variables from `.env.example` then configure it

### 4️⃣ Run Locally
```bash
npm run dev
```
Server will start at http://localhost:5000

---

## 🧪 API Testing with Postman

You can test all backend APIs using the provided Postman collection file: **`BondhuChol Tour Management.json`**

### 🔹 Steps to Import and Use

1.  **Open Postman**
    -   Download & install [Postman](https://www.postman.com/downloads/) if you don’t already have it.

2.  **Import the Collection**
    -   In Postman, click on **Import** (top left).
    -   Select the file **`BondhuChol Tour Management.json`** from the repository.
    -   A new collection named **BondhuChol Tour Management** will appear in your Postman sidebar.

3.  **Set the Base URL**
    -   Open the collection and click on the **Variables** tab.
    -   Set the variable `baseUrl` to the deployed API:
        ```
        https://bondhucoltmsbackend.vercel.app
        ```
        Or, if you want to run the backend locally on your computer, set it to:

        ```
        http://localhost:5000
        ```
        ⚠️ Note: To use the local URL, make sure the backend server is running on your machine (npm run dev).
    -   This will ensure all requests automatically use the correct backend URL.

4.  **Run the Endpoints**
    -   Expand the collection and choose any endpoint (e.g., `GET /api/v1/tours`).
    -   Click **Send** to make a request.
    -   You should see a JSON response from the live server.

5.  **(Optional) Run All Tests at Once**
    -   Click on the collection → **Run Collection**.
    -   This will execute all API requests sequentially and show the results.

✅ That’s it! Now you can easily test all APIs (authentication, tours, bookings, etc.) directly in Postman.

---
## 🌐 Live API Base URL
https://bondhucoltmsbackend.vercel.app


### Example Endpoints:

-   `GET /api/v1/tours` → Fetch all tours
-   `POST /api/v1/bookings` → Create a booking
-   `POST /api/v1/auth/login` → User login
-   `POST /api/v1/auth/google` → Google OAuth login