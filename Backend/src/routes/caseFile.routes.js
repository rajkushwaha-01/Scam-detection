import express from "express";
import { createCaseFile } from "../controller/caseFile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createCaseFile);

export default router;