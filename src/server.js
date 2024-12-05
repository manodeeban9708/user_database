// Import required modules
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB Atlas connection string
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Note: Use encryption for production
  createdAt: { type: Date, default: Date.now },
});

// Create the User model
const User = mongoose.model("User", userSchema);

// POST API for user registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// // GET API to fetch all registered users
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find({}, { password: 0 }); // Exclude password from the response
//     res.status(200).json({ users });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
// app.get("/", async (req, res) => {
//   try {
//     res.send("hello connected");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
