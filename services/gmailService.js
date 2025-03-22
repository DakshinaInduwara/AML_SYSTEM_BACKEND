import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Define paths
const CREDENTIALS_PATH = path.resolve('config', 'credentials.json');
const TOKEN_PATH = path.resolve('config', 'token.json'); // Store token in config folder

// Define Gmail API scopes
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Ensure credentials.json exists
if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error(`❌ Error: Missing credentials.json file at ${CREDENTIALS_PATH}`);
  process.exit(1);
}

// Load credentials.json and check structure
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));

if (!credentials.web) {
  console.error(`❌ Error: Invalid credentials.json format. Expected 'web' key.`);
  process.exit(1);
}

const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris?.[0] || 'http://localhost');

// Load or request new token
fs.readFile(TOKEN_PATH, async (err, token) => {
  if (err) {
    await getNewToken(oAuth2Client);
  } else {
    oAuth2Client.setCredentials(JSON.parse(token));
  }
});

// Function to get a new token
async function getNewToken(oAuth2Client) {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('\n🔗 Authorize this app by visiting this URL:\n', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('\n🔑 Enter the code from that page here: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('\n✅ Token stored at:', TOKEN_PATH);
      } catch (error) {
        console.error('\n❌ Error retrieving access token:', error);
      }
    });
  } catch (error) {
    console.error('\n❌ Error generating auth URL:', error);
  }
}

// Function to search for AML-related emails
async function listAmlEmails() {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'AML OR "Anti Money Laundering" OR "money laundering"',
    });

    const messages = res.data.messages || [];
    console.log(`📩 Found ${messages.length} AML-related message(s).`);

    let emailData = [];
    for (const message of messages) {
      const msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });

      emailData.push({
        id: message.id,
        snippet: msgRes.data.snippet,
      });
    }

    return emailData;
  } catch (error) {
    console.error('\n❌ Error fetching emails:', error);
    return [];
  }
}

export { listAmlEmails };
