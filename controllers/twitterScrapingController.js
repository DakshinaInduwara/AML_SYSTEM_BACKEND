import twitter from "../config/twitterClient.js"; // Import Twitter client configured earlier

// Function to fetch tweets containing AML news with retry logic
const fetchAMLTweets = async () => {
  try {
    // Define a search query for AML-related tweets
    const query = 'AML OR "Anti Money Laundering" OR "money laundering" -is:retweet lang:en';

    // Fetch tweets using Twitter API v2
    const tweets = await twitter.v2.search(query, {
      'tweet.fields': 'created_at,text,author_id',  // Specify the tweet fields you want
      'max_results': 10, // Max number of results you want
    });

    // Return the tweets data
    return tweets.data;
  } catch (error) {
    if (error.code === 429) {
      // Rate limit error
      const resetTime = error.headers['x-rate-limit-reset']; // Get reset time from headers
      const resetDate = new Date(resetTime * 1000); // Convert to readable date
      const delay = resetDate.getTime() - Date.now() + 1000; // Calculate delay until reset time

      console.log(`Rate limit exceeded. Retrying at: ${resetDate.toLocaleString()}`);
      // Wait until the reset time before retrying the request
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry fetching tweets after the delay
      return fetchAMLTweets();
    } else {
      console.error("Error fetching AML tweets:", error);
      return [];
    }
  }
};

export { fetchAMLTweets };
