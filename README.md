npm run dev```

The server will start and listen for requests at `http://localhost:5000`.

---

## 🧪 API Testing with Postman

A complete Postman collection is included to make API testing simple and efficient.

### Steps to Import and Use

1.  **Open Postman**
    *   If you don't have it, download and install [Postman](https://www.postman.com/downloads/).

2.  **Import the Collection**
    *   In Postman, click on **Import** in the top-left corner.
    *   Drag and drop or select the `BondhuChol Tour Management.json` file from this repository.
    *   A new collection named **BondhuChol Tour Management** will be created in your workspace.

3.  **Set the Base URL Variable**
    *   Right-click the imported collection and select **Edit**.
    *   Go to the **Variables** tab.
    *   Set the `baseUrl` variable to the deployed API endpoint:
        ```
        https://bondhucoltmsbackend.vercel.app
        ```
    *   *For local testing, you can set it to `http://localhost:5000`.*

4.  **Send Requests**
    *   Expand the collection and click on any endpoint (e.g., `GET /api/v1/tours`).
    *   Click **Send** to see the JSON response from the live server.

---

## 🌐 Live API Endpoints

The base URL for all API endpoints is: `https://bondhucoltmsbackend.vercel.app`

### Example Endpoints:

*   `GET /api/v1/tours` - Fetch all available tours.
*   `POST /api/v1/bookings` - Create a new booking (requires authentication).
*   `POST /api/v1/auth/login` - Log in a user and receive a JWT.
*   `GET /api/v1/auth/google` - Initiate the Google OAuth 2.0 login flow.