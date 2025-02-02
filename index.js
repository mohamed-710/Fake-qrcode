const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/configdb");

const qrRoutes = require("./routes/qrRoutes");

dotenv.config();

const app = express();
app.use(express.json());


const cloudinary = require("./config/cloudinary");



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


app.use("/", qrRoutes);

const PORT = process.env.PORT || 3000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
  });
