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

// Endpoint to serve HTML form
app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="post" enctype="multipart/form-data">
      <label for="product">Select Product:</label>
      <select id="product" name="product">
        <option value="Product1">Product 1</option>
        <option value="Product2">Product 2</option>
        <option value="Product3">Product 3</option>
        <option value="Product4">Product 4</option>
      </select>
      <br>

      <label for="date">Date:</label>
      <input type="date" id="date" name="date">
      <br>

      <label for="foobar">Foobar:</label>
      <input type="text" id="foobar" name="foobar">
      <br>

      <label for="fileUpload">Upload a File:</label>
      <input type="file" id="fileUpload" name="fileUpload">
      <br>

      <input type="submit" value="Submit">
    </form>
  `);
});

// Endpoint to handle form submission
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


  let fileDataDestination: string  = fileData?.destination || "";

//   fs.writeFileSync( path.join(fileData?.destination.toString(), fileData?.filename + '.json'), JSON.stringify(formData, null, 2));
  fs.writeFileSync( path.join(fileDataDestination, fileData?.filename + '.json'), JSON.stringify(formData, null, 2));

  res.json({"data": 'Form data received.'});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
