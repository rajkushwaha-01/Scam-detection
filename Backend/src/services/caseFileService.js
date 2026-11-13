import { GoogleGenAI, Type } from "@google/genai";
import { CASE_FILE_PROMPT } from "../prompts/caseFilePrompt.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const stringList = { type: Type.ARRAY, items: { type: Type.STRING } };

const email = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING },
    body: { type: Type.STRING },
  },
  required: ["subject", "body"],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    call_script_1930: stringList,
    complaint_text: { type: Type.STRING },
    complaint_text_hi: { type: Type.STRING },
    bank_email: email,
    bank_email_hi: email,
    evidence_checklist: stringList,
    next_steps: stringList,
    missing_info: stringList,
  },
  required: [
    "call_script_1930", "complaint_text", "complaint_text_hi",
    "bank_email", "bank_email_hi", "evidence_checklist",
    "next_steps", "missing_info",
  ],
};

// analysis = result from /api/analyze (user may have corrected it)
// user = { name, phone, bank_name, incident_time } (all optional)
export const generateCaseFile = async (analysis, user, language) => {
  const caseData = {
    language,
    scam_type: analysis.scam_type,
    red_flags: analysis.red_flags,
    extracted: analysis.extracted,
    user: {
      name: user?.name || null,
      phone: user?.phone || null,
      bank_name: user?.bank_name || null,
      incident_time: user?.incident_time || null,
    },
  };

  const response = await ai.models.generateContent({
    model,
    contents: `<case_data>\n${JSON.stringify(caseData, null, 2)}\n</case_data>`,
    config: {
      systemInstruction: CASE_FILE_PROMPT,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2,
    },
  });

  return JSON.parse(response.text);
};