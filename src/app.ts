//workflow: Route matching-> cotroller-> service-> model->MongoDB
//Mysteps: interface->model->controller->service-> Route creation

import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";

const app = express();

// Parses cookies and adds them to req.cookies
app.use(cookieParser());

// Parses incoming JSON requests and makes the data available in req.body
app.use(express.json());

// Parses URL-encoded form data (useful for forms submitted via POST)
app.use(express.urlencoded({ extended: true }));

// Enables cross-origin requests from client (frontend), allows credentials (cookies, headers) to be sent
app.use(cors({ origin: true, credentials: true }));

app.set("trust proxy", 1);

// Configures and initializes session support for persistent login sessions
app.use(
  expressSession({
    secret: "secret", // Secret key to sign session ID cookies (should be from env in production)
    resave: false, // Avoids resaving session if nothing has changed
    saveUninitialized: false, // Doesn't save empty sessions
  })
);

// Initializes Passport for authentication middleware
app.use(passport.initialize());
// Connects Passport with the session for persistent login (serialization/deserialization)
app.use(passport.session());

// Mounts all application routes under /api/v1
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to BondhuChol Tour Management System!");
});

// Handles application-wide errors (after route handling)
app.use(globalErrorHandler);
// Handles unmatched routes (404 Not Found)
app.use(notFound);

export default app;
