const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/configdb");
const { v2: cloudinary } = require("cloudinary");
const qrRoutes = require("./routes/qrRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Use QR routes
app.use("/", qrRoutes);

const PORT = process.env.PORT || 3000;

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
