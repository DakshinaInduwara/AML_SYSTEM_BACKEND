import axios from "axios";
import cheerio from "cheerio";
import FraudNews from "../models/FraudNews.js";

export const fetchFraudNews = async () => {
  const sources = [
    "https://www.mastercard.com/newsroom/",
    "https://www.visa.com/newsroom/",
    "https://www.lankapay.net/news/",
  ];

  for (let url of sources) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      
      $(".news-item").each(async (i, el) => {
        const title = $(el).find("h3").text();
        const link = $(el).find("a").attr("href");

        const exists = await FraudNews.findOne({ title });
        if (!exists) {
          await FraudNews.create({ title, link, source: url });
        }
      });

      console.log(`✅ News fetched from ${url}`);
    } catch (error) {
      console.error(`❌ Error fetching news from ${url}:`, error);
    }
  }
};
