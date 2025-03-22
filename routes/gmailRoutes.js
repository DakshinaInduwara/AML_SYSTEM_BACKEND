import express from 'express';
import { getAmlEmails } from '../controllers/gmailController.js';

const router = express.Router();

router.get('/aml-emails', getAmlEmails);

export default router;
