import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

// Use the PORT from environment variables or default to 3000
const PORT = ENV.PORT || 3000;

// Middleware setup
app.use(express.json({ limit: "5mb" })); 
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// This block will run only in the production environment on Render
if (ENV.NODE_ENV === "production") {
  // Define the path to the frontend's build directory
  const buildPath = path.join(__dirname, "../frontend/dist");

  // Serve static files from the React frontend app
  app.use(express.static(buildPath));

  // The "catchall" handler: for any request that doesn't match an API route,
  // send back the main index.html file from the React app.
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
