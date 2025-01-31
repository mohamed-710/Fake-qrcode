const qrcode = require('qrcode');
const path = require('path');
const Url = require('../model/UrlModel');

const generateQrCode = async (req, res) => {
  const { originalUrl, fakePath } = req.body; 

  if (!originalUrl || !fakePath) {
    return res.status(400).json({ message: 'Original URL and Fake Path are required' });
  }

  try {
   
    const fakeUrl = `${req.protocol}://${req.get('host')}/${fakePath}`;

   
    const qrCodeFileName = `qr-${Date.now()}.png`;
    const qrCodePath = path.join(__dirname, '../public/qrcodes', qrCodeFileName);
    await qrcode.toFile(qrCodePath, fakeUrl); 

    
    const newUrl = await Url.create({
      originalUrl,
      fakeUrl, 
      fakePath, 
      qrCodePath: `/qrcodes/${qrCodeFileName}`
    });

    res.status(201).json({
      message: 'QR Code Generated Successfully!',
      fakeUrl, 
      qrCode: `/qrcodes/${qrCodeFileName}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  const { fakePath } = req.params; 

  try {
    const urlEntry = await Url.findOne({ fakePath }); 

    if (urlEntry) {
      return res.redirect(urlEntry.originalUrl);
    } else {
      return res.status(404).json({ message: 'URL not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQrCode, redirectToOriginalUrl };