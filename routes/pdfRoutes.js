// routes/pdfRoutes.js
const express = require("express");
const multer = require("multer");
const { renderUpload, procesarPDF } = require("../controllers/pdfController.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/upload", renderUpload);
router.post("/upload", upload.single("pdfFile"), procesarPDF);

module.exports = router;
