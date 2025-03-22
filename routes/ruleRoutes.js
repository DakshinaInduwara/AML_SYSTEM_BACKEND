import express from "express";
import Rule from "../models/Rule.js";
import { createAMLRule } from "../controllers/ruleController.js"; // Import the createAMLRule function

const router = express.Router();

// Get All Rules
router.get("/", async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    console.error("Error fetching rules:", error);
    res.status(500).json({ message: "Error fetching rules" });
  }
});

// Add New Rule (Can be used for both manual and automated rule creation)
router.post("/", async (req, res) => {
  try {
    // Call the createAMLRule function to handle the rule creation logic
    const newRule = await createAMLRule(req.body);
    res.json({ message: "✅ Rule added successfully!" });
  } catch (error) {
    console.error("Error adding rule:", error);
    res.status(500).json({ message: "Error adding rule" });
  }
});

// This is an additional route for handling the automated rule creation from Twitter
router.post("/twitter", async (req, res) => {
  try {
    const { tweet } = req.body; // Expecting tweet object in the request body

    // Construct ruleData from the tweet data
    const ruleData = {
      title: tweet.text, // Tweet text
      source: 'Twitter', // Static source for Twitter
      link: `https://twitter.com/${tweet.author_id}/status/${tweet.id}`, // Tweet link
      keywords: tweet.keywords || [], // Optional keywords if provided in tweet
    };

    // Use the createAMLRule function to save the rule to the database
    await createAMLRule(ruleData);

    res.json({ message: "✅ AML Rule from Twitter added successfully!" });
  } catch (error) {
    console.error("Error processing Twitter AML rule:", error);
    res.status(500).json({ message: "Error processing Twitter AML rule" });
  }
});

export default router;
