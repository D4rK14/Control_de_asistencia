// routes/pdfRoutes.js
const express = require("express");
const multer = require("multer");
const { renderUpload, procesarPDF, renderPdfView } = require("../controllers/pdfController.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/inasistencia", renderUpload);
// router.post("/inasistencia", upload.single("pdfFile"), procesarPDF);

router.get("/licencia_medica", renderPdfView);
// router.post("/licencia_medica", upload.single("pdfFile"), procesarPDF);

module.exports = router;
