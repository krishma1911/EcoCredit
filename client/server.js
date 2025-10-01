// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("Received file:", req.file.originalname);
  res.json({ success: true, filename: req.file.originalname });
});

app.listen(5000, () => console.log("Server running on port 5000"));
