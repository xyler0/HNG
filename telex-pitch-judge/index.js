import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { evaluatePitch } from "./utils/evaluate.js";
import Evaluation from "./data/logs.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { dbName: "pitchjudge" })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

app.get("/clock", (req, res) => res.json({ status: "alive" }));

app.get("/agent.json", (req, res) => {
  res.json({
    name: "AI Pitch Judge",
    description: "Evaluates startup pitches using Gemini AI",
    version: "1.0.0",
  });
});

app.post("/run", async (req, res) => {
  const { pitch } = req.body;
  if (!pitch) return res.status(400).json({ error: "Missing pitch text" });
  try {
    const result = await evaluatePitch(pitch);
    await Evaluation.create({ pitch, result });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});
app.get('/history/top', async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setDate(today.getDate() - 1);
    end.setHours(23, 59, 59, 999);

    const pitches = await Evaluation.find({
      createdAt: { $gte: start, $lte: end }
    }).sort({ 'result.overall_score': -1 }).limit(10);

    if (!pitches.length) {
      return res.json({
        message: "No pitches recorded yesterday",
        date: start.toDateString(),
        top_pitches: []
      });
    }

    res.json({
      date: start.toDateString(),
      top_pitches: pitches
    });
  } catch (err) {
    console.error('History route error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// latest 2 pitches (for testing)
app.get('/history/latest', async (req, res) => {
  try {
    const recent = await Evaluation.find().sort({ createdAt: -1 }).limit(2);
    res.json(recent);
  } catch (err) {
    console.error('Latest route error:', err);
    res.status(500).json({ error: 'Failed to fetch recent pitches' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));