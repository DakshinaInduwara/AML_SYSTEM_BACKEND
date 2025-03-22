import mongoose from "mongoose";

// Updated Rule Schema to include source (Twitter) and tweet link
const RuleSchema = new mongoose.Schema({
  ruleName: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String }], 
  source: { type: String, required: true }, // Source (Twitter)
  link: { type: String, required: true }, // Link to the tweet
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Rule", RuleSchema);
