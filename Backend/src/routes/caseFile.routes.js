import express from "express";
import { createCaseFile } from "../controller/caseFile.controller.js";

const router = express.Router();

router.post("/", createCaseFile);

export default router;