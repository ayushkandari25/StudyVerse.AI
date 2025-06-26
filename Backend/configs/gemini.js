require("dotenv").config();
const fetch = require("node-fetch");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateWithGemini(promptText) {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini API Error");
  }

  return data.candidates[0]?.content?.parts[0]?.text || "";
}

module.exports = generateWithGemini;
