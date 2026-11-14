import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const nullableString = { type: Type.STRING, nullable: true };

// Tells Gemini exactly what JSON to return
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    verdict: { type: Type.STRING, enum: ["SCAM", "SUSPICIOUS", "SAFE", "NOT_ENOUGH_INFO"] },
    risk_score: { type: Type.INTEGER },
    confidence: { type: Type.NUMBER },
    scam_type: {
      type: Type.STRING,
      enum: [
        "DIGITAL_ARREST", "INVESTMENT_FRAUD", "KYC_PHISHING", "UPI_COLLECT",
        "FAKE_JOB", "LOTTERY_PRIZE", "LOAN_APP", "SEXTORTION", "E_COMMERCE",
        "IMPERSONATION_OTHER", "OTHER", "NONE",
      ],
    },
    incident_stage: { type: Type.STRING, enum: ["ATTEMPT_ONLY", "MONEY_LOST", "UNKNOWN"] },
    red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
    red_flags_hi: { type: Type.ARRAY, items: { type: Type.STRING } },
    extracted: {
      type: Type.OBJECT,
      properties: {
        amount_inr: { type: Type.NUMBER, nullable: true },
        transaction_id: nullableString,
        scammer_upi_or_account: nullableString,
        scammer_phone: nullableString,
        scammer_url_or_app: nullableString,
        contact_channel: {
          type: Type.STRING,
          enum: ["WHATSAPP", "TELEGRAM", "SMS", "CALL", "EMAIL", "SOCIAL_MEDIA", "APP", "OTHER"],
          nullable: true,
        },
        incident_time_text: nullableString,
      },
    },
    needs_verification: { type: Type.ARRAY, items: { type: Type.STRING } },
    explanation_hi: { type: Type.STRING },
    explanation_en: { type: Type.STRING },
    immediate_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    immediate_steps_hi: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    "verdict", "risk_score", "confidence", "scam_type", "incident_stage",
    "red_flags", "red_flags_hi", "extracted", "needs_verification",
    "explanation_hi", "explanation_en", "immediate_steps", "immediate_steps_hi",
  ],
};

// text = message from user, files = screenshot/audio uploads from multer
export const analyzeIncident = async (text, files = []) => {
  const parts = files.map((file) => ({
    inlineData: { mimeType: file.mimetype, data: file.buffer.toString("base64") },
  }));

  parts.push({
    text: `<user_content>\n${text || "(analyze the provided audio or screenshot)"}\n</user_content>`,
  });

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2,
    },
  });

  return JSON.parse(response.text);
};