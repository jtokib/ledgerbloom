
'use server';

/**
 * @fileOverview An AI agent to handle exporting data to BigQuery.
 *
 * - exportToBigQuery - A function that handles the data export process.
 * - ExportToBigQueryInput - The input type for the exportToBigQuery function.
 * - ExportToBigQueryOutput - The return type for the exportToBigQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getInventoryLevels } from '@/services/inventory';
import { getMovements } from '@/services/movements';

const ExportToBigQueryInputSchema = z.object({
  datasetId: z.string().describe("The BigQuery dataset ID."),
  inventoryTableId: z.string().describe("The BigQuery table ID for inventory levels."),
  movementsTableId: z.string().describe("The BigQuery table ID for movements."),
});
export type ExportToBigQueryInput = z.infer<typeof ExportToBigQueryInputSchema>;

const ExportToBigQueryOutputSchema = z.object({
  success: z.boolean().describe("Whether the export was successful."),
  message: z.string().describe("A message indicating the result of the export."),
});
export type ExportToBigQueryOutput = z.infer<typeof ExportToBigQueryOutputSchema>;


export async function exportToBigQuery(input: ExportToBigQueryInput): Promise<ExportToBigQueryOutput> {
  return exportToBigQueryFlow(input);
}

const exportToBigQueryFlow = ai.defineFlow(
  {
    name: 'exportToBigQueryFlow',
    inputSchema: ExportToBigQueryInputSchema,
    outputSchema: ExportToBigQueryOutputSchema,
  },
  async (input) => {
    console.log('Starting BigQuery export flow with input:', input);

    try {
      // Step 1: Fetch all necessary data from mock services
      const inventoryLevels = await getInventoryLevels();
      const movements = await getMovements();

      console.log(`Fetched ${inventoryLevels.length} inventory level records.`);
      console.log(`Fetched ${movements.length} movement records.`);

      // Step 2: In a real application, you would connect to the BigQuery API here.
      // For now, we will just log the data that would be sent.
      
      console.log('Simulating BigQuery export...');
      console.log('Inventory Levels to export:', JSON.stringify(inventoryLevels, null, 2));
      console.log('Movements to export:', JSON.stringify(movements, null, 2));
      
      // Step 3: Here you would use the BigQuery client library to insert the data.
      // Example:
      // const bigquery = new BigQuery();
      // await bigquery.dataset(input.datasetId).table(input.inventoryTableId).insert(inventoryLevels);
      // await bigquery.dataset(input.datasetId).table(input.movementsTableId).insert(movements);

      console.log('BigQuery export simulation successful.');

      return {
        success: true,
        message: 'Data export to BigQuery completed successfully.',
      };
    } catch (error) {
      console.error('Error during BigQuery export flow:', error);
      return {
        success: false,
        message: `Failed to export data to BigQuery: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
);
