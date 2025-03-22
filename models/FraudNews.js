import mongoose from "mongoose";

const FraudNewsSchema = new mongoose.Schema({
  title: String,
  link: String,
  source: String,
  date: Date,
});

const FraudNews = mongoose.model("FraudNews", FraudNewsSchema);

export default FraudNews;
