import { analyzeIncident } from "../services/aiService.js";

const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"];
const allowedAudioTypes = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/aiff",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
  "audio/mp4",
];

// POST /api/analyze
export const analyze = async (req, res) => {
  try {
    const { message } = req.body;
    const screenshot = req.files?.screenshot?.[0];
    const audio = req.files?.audio?.[0];
    const files = [screenshot, audio].filter(Boolean);

    if (!message?.trim() && !files.length) {
      return res.status(400).json({ message: "Send a message, screenshot, or audio file" });
    }

    if (screenshot && !allowedImageTypes.includes(screenshot.mimetype)) {
      return res.status(400).json({ message: "Only PNG, JPG or WEBP screenshots are allowed" });
    }

    if (audio && !allowedAudioTypes.includes(audio.mimetype)) {
      return res.status(400).json({ message: "Unsupported audio format" });
    }

    const result = await analyzeIncident(message?.trim(), files);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};