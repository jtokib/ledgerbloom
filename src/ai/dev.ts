// Since Next.js automatically loads .env files, you don't need to call config() manually.
// This file is the entry point for the Genkit development server.
import 'dotenv/config';

import '@/ai/flows/inventory-optimization-suggestions.ts';
import '@/ai/flows/export-to-bigquery.ts';
import '@/ai/flows/suggest-order-items.ts';
