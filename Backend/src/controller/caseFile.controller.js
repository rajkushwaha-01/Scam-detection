import { generateCaseFile } from "../services/caseFileService.js";

// POST /api/casefile
export const createCaseFile = async (req, res) => {
  try {
    const { analysis, user, language } = req.body;

    if (!analysis || typeof analysis !== "object") {
      return res.status(400).json({ message: "analysis is required" });
    }

    if (analysis.incident_stage !== "MONEY_LOST") {
      return res
        .status(400)
        .json({ message: "Case file is only for cases where money was lost" });
    }

    const caseFile = await generateCaseFile(
      analysis,
      user,
      language === "en" ? "en" : "hi"
    );

    res.json(caseFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};