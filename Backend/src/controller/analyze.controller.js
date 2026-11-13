import { analyzeIncident } from "../services/aiService.js";

const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

// POST /api/analyze
export const analyze = async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;

    if (!message?.trim() && !file) {
      return res.status(400).json({ message: "Send a message or a screenshot" });
    }

    if (file && !allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Only PNG, JPG or WEBP images allowed" });
    }

    const result = await analyzeIncident(message?.trim(), file);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};