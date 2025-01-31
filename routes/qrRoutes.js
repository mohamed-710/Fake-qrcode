const express = require('express');
const router = express.Router();
const { generateQrCode, redirectToOriginalUrl } = require('../controllers/qrConttroller');


router.post('/generate', generateQrCode);


router.get('/:fakePath(*)', redirectToOriginalUrl);

module.exports = router;