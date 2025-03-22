import { listAmlEmails } from '../services/gmailService.js';

export const getAmlEmails = async (req, res) => {
  try {
    const emails = await listAmlEmails();
    res.json({ success: true, emails });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching AML emails', error });
  }
};
