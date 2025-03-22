import puppeteer from 'puppeteer';

const scrapeAMLArticlesWithPuppeteer = async () => {
  const url = 'https://www.imf.org/en/Topics/Financial-Integrity/amlcft'; // Replace with the actual website URL

  try {
    // Launch Puppeteer browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url);

    // Extract article titles and links using Puppeteer
    const articles = await page.evaluate(() => {
      const data = [];
      const articleElements = document.querySelectorAll('article');
      
      articleElements.forEach(article => {
        const title = article.querySelector('h2')?.innerText;
        const link = article.querySelector('a')?.href;
        
        if (title && link) {
          data.push({ title, link });
        }
      });

      return data;
    });

    await browser.close();

    return articles; // Return the extracted articles
  } catch (error) {
    console.error('Error scraping AML articles with Puppeteer:', error);
    return [];
  }
};

export { scrapeAMLArticlesWithPuppeteer };
