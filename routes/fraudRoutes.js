import express from "express";
import FraudRule from "../models/FraudRule.js";
import FraudNews from "../models/FraudNews.js";


const router = express.Router();

// Get fraud news
router.get("/news", async (req, res) => {
  const news = await FraudNews.find().sort({ createdAt: -1 });
  res.json(news);
});

// Get fraud rules
router.get("/rules", async (req, res) => {
  const rules = await FraudRule.find().sort({ createdAt: -1 });
  res.json(rules);
});

// Add fraud rule
router.post("/rules", async (req, res) => {
  const { description, createdBy } = req.body;
  const rule = await FraudRule.create({ description, createdBy });
  res.json(rule);
});

export default router;
