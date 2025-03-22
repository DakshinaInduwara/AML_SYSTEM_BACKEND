import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import axios from "axios"; // Import axios for HTTP requests
import * as cheerio from "cheerio"; // Correct import for Cheerio
import { scrapeAMLArticlesWithPuppeteer } from "./controllers/puppeteerScrapingController.js"; // Import Puppeteer scraper

// Import MongoDB connection
import connectDB from "./config/db.js";

// Import Routes
import fraudRoutes from "./routes/fraudRoutes.js";
import ruleRoutes from "./routes/ruleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import gmailRoutes from "./routes/gmailRoutes.js"; // Import Gmail routes

// Import Twitter Scraping Controller and Rule Controller
import { fetchAMLTweets } from './controllers/twitterScrapingController.js';
import { createAMLRule } from './controllers/ruleController.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/rules", ruleRoutes);
app.use('/api/gmail', gmailRoutes); // Added Gmail Routes

// Web Scraping with Cheerio (Static HTML Parsing)
const scrapeAMLArticlesWithCheerio = async () => {
  const url = "https://example-aml-news-website.com"; // Replace with the actual website you want to scrape
  try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(url);
    
    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Extract titles and links of articles
    const articles = [];
    $("article").each((index, element) => {
      const title = $(element).find("h2").text(); // Example: looking for <h2> elements
      const link = $(element).find("a").attr("href"); // Extracting href attribute for the link
      articles.push({ title, link });
    });

    return articles; // Returning the extracted articles
  } catch (error) {
    console.error("Error scraping AML articles with Cheerio:", error);
    return [];
  }
};

// Automated Job: Fetch fraud news and AML articles every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("🔍 Running Fraud News Scraper...");

  // Scrape fraud news (Assuming scrapeNews is another function you already have)
  await scrapeNews();

  // Scrape AML articles using Cheerio (Static HTML Scraping)
  const amlArticlesCheerio = await scrapeAMLArticlesWithCheerio();
  console.log("AML Articles (Cheerio):", amlArticlesCheerio);

  // Scrape AML articles using Puppeteer (Dynamic Content Scraping)
  const amlArticlesPuppeteer = await scrapeAMLArticlesWithPuppeteer();
  console.log("AML Articles (Puppeteer):", amlArticlesPuppeteer); // Log the scraped articles
});

// Schedule the task to run every minute for Twitter scraping
cron.schedule('* * * * *', async () => {
  console.log("🔍 Checking for AML-related tweets...");

  // Fetch AML-related tweets from Twitter
  const tweets = await fetchAMLTweets();

  // Process each tweet and create AML rules
  for (const tweet of tweets) {
    // Extract relevant information from the tweet and create a rule
    const ruleData = {
      title: tweet.text,
      source: 'Twitter',
      link: `https://twitter.com/${tweet.author_id}/status/${tweet.id}`,
    };

    // Create a rule in the database
    await createAMLRule(ruleData);
    console.log("Created AML Rule:", ruleData);
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
