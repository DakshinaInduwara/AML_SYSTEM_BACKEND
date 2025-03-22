import mongoose from "mongoose";

const FraudRuleSchema = new mongoose.Schema({
  description: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("FraudRule", FraudRuleSchema);
