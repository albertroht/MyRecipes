const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb('Type file is not access', false);
  }
};

const upload = multer({ fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } });

module.exports = upload;
