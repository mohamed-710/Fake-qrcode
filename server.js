const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/configdb");
const fs = require("fs").promises;

dotenv.config();

const app = express();
const qrRoutes = require("./routes/qrRoutes");


app.use(express.json());
app.use(express.static("public"));


app.use("/", qrRoutes);


const qrCodeDir = path.join(__dirname, "public/qrcodes"); 

async function createQrCodeDir() {
  try {
    await fs.access(qrCodeDir);
  } catch (error) {
    await fs.mkdir(qrCodeDir, { recursive: true });
  }
}

createQrCodeDir().catch(console.error); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


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