const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const File = require("../models/File");


// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


// FILE FILTER (images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;

  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};


// MULTER CONFIG
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter
});


// UPLOAD IMAGE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
      url: `http://localhost:5000/uploads/${req.file.filename}`
    });

    await file.save();

    res.status(201).json(file);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ALL FILES
router.get("/", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;