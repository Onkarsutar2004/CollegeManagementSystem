import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectToMongoDB } from "./mongodb";
import dotenv from 'dotenv';  // Corrected import
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging request duration
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Main function to initialize server
(async () => {
  let mongoConnected = false;
  
  try {
    // Check if MongoDB URI is provided and properly formatted
    const mongodbUri = process.env.MONGODB_URI;
    const isValidMongoUri = mongodbUri && (
      mongodbUri.startsWith('mongodb://') || 
      mongodbUri.startsWith('mongodb+srv://')
    );
    
    if (!isValidMongoUri) {
      log("⚠️ Invalid or missing MongoDB URI");
      log("Please provide a valid MongoDB URI in the MONGODB_URI environment variable.");
      log("A valid URI starts with 'mongodb://' or 'mongodb+srv://'");
      log("The application will continue with in-memory storage (data will not persist).");
    }
    
    // Try connecting to MongoDB
    try {
      await connectToMongoDB();
      log("✅ Connected to MongoDB database");
      mongoConnected = true;
    } catch (mongoError) {
      log("⚠️ Could not connect to MongoDB: " + (mongoError as Error).message);
      log("The application will continue with in-memory storage.");
    }
    
    // Register routes and handle errors
    const server = await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // Setup Vite for development environment
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start the server
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🚀 Server running on port ${port}`);
      if (!mongoConnected) {
        log("⚠️ Running without MongoDB connection - data will not be persisted");
      }
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
})();
