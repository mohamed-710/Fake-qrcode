const validateUrl = (req, res, next) => {
    const { url } = req.body;
  

    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ message: 'Invalid URL' });
    }
  
    next();
  };
  
  module.exports = validateUrl;