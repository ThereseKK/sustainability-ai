import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateResponse = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
  });
  return completion.choices[0]?.message?.content || "Intet svar fundet.";
};

app.post("/api/generate-agenda", async (req, res) => {
  const { industry } = req.body;
  const prompt = `Giv en samtaleagenda og bæredygtige tiltag for branchen ${industry} med troværdige kilder.`;
  const response = await generateResponse(prompt);
  res.json({ agenda: response });
});

app.post("/api/ask-ai", async (req, res) => {
  const { question } = req.body;
  const response = await generateResponse(`Besvar: ${question}`);
  res.json({ answer: response });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));
