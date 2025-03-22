import axios from "axios";
import { load } from "cheerio";  // ✅ Corrected import
import Rule from "../models/Rule.js";

// Fetch news from sources
export const scrapeNews = async () => {
  try {
    const sources = [
      "https://news.mastercard.com/", 
      "https://newsroom.visa.com/",
      "https://www.lankapay.net/news"
    ];

    for (const url of sources) {
      const { data } = await axios.get(url);
      const $ = load(data);  // ✅ Corrected usage

      $("article").each(async (i, el) => {
        const title = $(el).find("h2").text().trim();
        const link = $(el).find("a").attr("href");

        console.log(`🔎 Found news: ${title}`);

        // Add fraud detection rule based on news (Example Logic)
        const ruleExists = await Rule.findOne({ ruleName: title });
        if (!ruleExists) {
          await Rule.create({ ruleName: title, description: `Auto-detected fraud rule based on news`, keywords: [title] });
        }
      });
    }
  } catch (error) {
    console.error("❌ Error fetching news:", error);
  }
};
