import express from "express";
import multer from "multer";
import { analyze } from "../controller/analyze.controller.js";

const router = express.Router();

// Keep one screenshot and one audio file in memory (max 5 MB each).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 2 },
});

router.post(
  "/",
  upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  analyze
);

export default router;