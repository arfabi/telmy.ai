import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const candidates = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'];

for (const m of candidates) {
  try {
    const model = genAI.getGenerativeModel({
      model: m,
      generationConfig: { responseMimeType: 'application/json' }
    });
    const prompt = 'Explain Indonesian government form field "Tempat Lahir" in English as JSON: { "label": "Place of Birth", "meaning": "City where applicant was born", "howToFill": "Write official birth city", "example": "New York, USA", "commonMistakes": ["Hospital name"], "tipsForForeigners": "Match passport city" }';
    const res = await model.generateContent(prompt);
    console.log(`✅ Model ${m} SUCCESS! Response:`);
    console.log(res.response.text());
    break;
  } catch (e) {
    console.log(`❌ Model ${m} failed: ${e.message}`);
  }
}
