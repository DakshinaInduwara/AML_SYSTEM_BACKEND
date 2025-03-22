import axios from 'axios';
import cheerio from 'cheerio';

// Example function to scrape AML articles from a website
const scrapeAMLArticles = async () => {
  const url = 'https://www.imf.org/en/Topics/Financial-Integrity/amlcft'; // Replace with the actual website you want to scrape
  try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(url);
    
    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Extract titles and links of articles
    const articles = [];
    $('article').each((index, element) => {
      const title = $(element).find('h2').text(); // Example: looking for <h2> elements
      const link = $(element).find('a').attr('href'); // Extracting href attribute for the link
      articles.push({ title, link });
    });

    return articles; // Returning the extracted articles
  } catch (error) {
    console.error('Error scraping AML articles:', error);
    return [];
  }
};

export { scrapeAMLArticles };
