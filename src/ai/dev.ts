
import { config } from 'dotenv';
config();

import '@/ai/flows/inventory-optimization-suggestions.ts';
import '@/ai/flows/export-to-bigquery.ts';
import '@/ai/flows/suggest-order-items.ts';
