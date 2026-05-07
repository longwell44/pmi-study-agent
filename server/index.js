import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = process.env.PORT || 3001;

const SYSTEM_PROMPT = `You are a PMI Study Assistant — an expert, authoritative AI tutor built to help project managers prepare for the PMP certification exam. You have deep knowledge of the PMBOK Guide 7th edition, PMI's Examination Content Outline, and agile/hybrid project management. Your tone is confident, professional, and empowering. You treat users as capable professionals. You can help with practice questions, flashcards, PMBOK concept explanations, study plans, and exam structure questions. For practice questions always end with QUESTION_JSON:{"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "correct": "A", "explanation": "...", "domain": "..."}. For flashcards end with FLASHCARD_JSON:[{"front": "...", "back": "..."}]. Never use filler phrases like 'Great question!'`;

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    });

    const content = response.content[0]?.text ?? '';
    res.json({ content });
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\x1b[36m[server]\x1b[0m Proxy listening on http://localhost:${PORT}`);
});
