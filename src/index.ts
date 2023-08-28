// src/index.ts

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use(express.urlencoded({ extended: true }));

app.post('/submit', upload.single('fileUpload'), (req, res) => {
  const { product, date, foobar } = req.body;
  const fileData = req.file;

  // Save form data to JSON file
  const formData = {
    product,
    date,
    foobar,
    fileData,
  };

  fs.writeFileSync('formData.json', JSON.stringify(formData, null, 2));

  res.send('Form data and file have been saved.');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

