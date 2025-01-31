const qrcode = require("qrcode");
const Url = require("../model/UrlModel");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const streamifier = require("streamifier");

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateQrCode = async (req, res) => {
  const { originalUrl, fakePath } = req.body;

  if (!originalUrl || !fakePath) {
    return res.status(400).json({ message: "Original URL and Fake Path are required" });
  }

  try { 
    // Generate the fake URL
    const fakeUrl = `${req.protocol}://${req.get("host")}/${fakePath}`;

    // Generate QR code as a Buffer (no local storage)
    const qrCodeBuffer = await qrcode.toBuffer(fakeUrl);

    // Upload QR code to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "qrcodes", resource_type: "image" }, 
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        // Save URL to the database
        const newUrl = await Url.create({
          originalUrl,
          fakeUrl,
          fakePath,
          qrCodePath: result.secure_url, // Store Cloudinary URL
        });

        res.status(201).json({
          message: "QR Code Generated Successfully!",
          fakeUrl,
          qrCode: result.secure_url, // Return Cloudinary URL
        });
      }
    );

    // Convert buffer to a readable stream and pipe it to Cloudinary
    streamifier.createReadStream(qrCodeBuffer).pipe(uploadStream);
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  const { fakePath } = req.params;

  try {
    const urlEntry = await Url.findOne({ fakePath });

    if (urlEntry) {
      return res.redirect(urlEntry.originalUrl);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQrCode, redirectToOriginalUrl };
