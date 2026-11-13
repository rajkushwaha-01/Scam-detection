import express from "express";
import multer from "multer";
import { analyze } from "../controller/analyze.controller.js";

const router = express.Router();

// keep the screenshot in memory (max 5 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("screenshot"), analyze);

export default router;