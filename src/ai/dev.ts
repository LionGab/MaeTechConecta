import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-relevant-matches.ts';
import '@/ai/flows/moderate-forum-content.ts';
import '@/ai/flows/answer-common-questions.ts';
