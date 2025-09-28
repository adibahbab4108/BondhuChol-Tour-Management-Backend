// workflow of backend: Run->connectRedis->startServer->connect mongoose->start Express server->Create Super Admin->Route+middleware->controller->process handler

/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import { envVar } from "./app/config/env.config";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    if (!envVar.DB_URL) {
      throw new Error(
        "Database URL (DB_URL) is not defined in environment variables."
      );
    }
    await mongoose.connect(envVar.DB_URL);
    console.log("Connected to MongoDB");

    server = app.listen(envVar.PORT, () => {
      console.log(`Server is running on port ${envVar.PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

// Handle unhandled promise rejections for async errors
// This is important for production applications to avoid crashes
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);

  if (server) {
    server.close(() => {
      process.exit(1); // Exit the process with a failure code
    });
  }
  process.exit(1);
});
// Promise.reject(new Error("Unhandled Rejection detected"));

// Handle uncaught exceptions for sync errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // process.exit(1);
});
// throw new Error("Uncaught Exception detected");

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed. Exiting process.");
      process.exit(0); // Exit the process with a success code
    });
  } else {
    process.exit(0); // Exit the process with a success code
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed. Exiting process.");
      process.exit(0); // Exit the process with a success code
    });
  } else {
    process.exit(0); // Exit the process with a success code
  }
});
