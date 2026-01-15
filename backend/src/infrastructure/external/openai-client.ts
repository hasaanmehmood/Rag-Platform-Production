import OpenAI from 'openai';
import { config } from '../../config/index.js';

export const openaiClient = new OpenAI({
  apiKey: config.openai.apiKey,
});

export default openaiClient;