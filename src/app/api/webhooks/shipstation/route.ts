
import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '@/app/actions';
import type { FulfillmentData } from '@/lib/types';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedApiKey = `Bearer ${process.env.SHIPSTATION_WEBHOOK_API_KEY}`;

  if (!process.env.SHIPSTATION_WEBHOOK_API_KEY || authHeader !== expectedApiKey) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const fulfillmentData = (await req.json()) as FulfillmentData;

    // Basic validation
    if (!fulfillmentData.orderId || !fulfillmentData.items || !Array.isArray(fulfillmentData.items)) {
        return new NextResponse('Bad Request: Missing or invalid fulfillment data.', { status: 400 });
    }

    const result = await fulfillOrder(fulfillmentData);

    if (result.success) {
      return NextResponse.json({ message: 'Fulfillment processed successfully' });
    } else {
      // If the action failed, it might be due to business logic (e.g., order not found)
      return new NextResponse(result.error, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing ShipStation webhook:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(`Internal Server Error: ${message}`, { status: 500 });
  }
}
