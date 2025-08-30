# ShipStation Integration Plan

This document outlines the plan to integrate the LedgerBloom application with the existing ShipStation Firebase Function.

## Architecture Overview

The integration will follow a service-oriented architecture where the LedgerBloom application will fetch data from the Firebase Function endpoints, which act as a proxy to the ShipStation API. This keeps the ShipStation logic centralized and makes LedgerBloom a consumer of that data.

LedgerBloom's primary role will shift to being the inventory ledger, tracking movements based on fulfillments reported by the ShipStation service.

## Sprint Plan: Phased Integration

### Phase 1: Product Data Integration (Read-Only)

**Goal:** Replace mock product data in LedgerBloom with live product data from ShipStation.

1.  **Create a New Service (`src/services/shipstation.ts`):**
    *   Create a new service file to encapsulate all logic for calling the Firebase Function HTTP endpoints.
    *   This service will require the base URL of your Firebase Function, which you will need to provide.
    *   It will handle `fetch` requests and JSON parsing.

2.  **Implement `getProductsFromShipStation` function:**
    *   Inside `src/services/shipstation.ts`, create a function that calls the `/listInventory` endpoint of the Firebase Function.
    *   It should transform the raw API response into the `Product[]` type expected by the LedgerBloom UI.

3.  **Update Products Page (`src/app/dashboard/products/page.tsx`):**
    *   Modify the page to call the new `getProductsFromShipStation` service instead of the existing Firestore service.
    *   The "Add Product," "Edit Product," and "Delete Product" functionalities will be removed from this page, as product master data will now be managed in ShipStation.

### Phase 2: Order Data Integration (Read-Only)

**Goal:** Display live order data from ShipStation within LedgerBloom.

1.  **Implement `getOrdersFromShipStation` function:**
    *   In `src/services/shipstation.ts`, create a function to call the `/fetchOrders` endpoint of your Firebase Function.
    *   This function will accept date ranges for filtering.
    *   It will transform the API response into the `Order[]` type.

2.  **Update Orders Page (`src/app/dashboard/orders/page.tsx`):**
    *   Update the page to fetch and display orders using the new `getOrdersFromShipStation` service.
    *   Remove the "Create Order" dialog.
    *   The "Edit Order" dialog will be repurposed later to handle manual fulfillment linking if needed.

### Phase 3: Fulfillment Integration

**Goal:** Connect the fulfillment process to the inventory ledger.

1.  **Update Fulfillment Webhook (`/api/webhooks/shipstation/route.ts`):**
    *   The existing webhook is a good foundation. We will keep it as the entry point for fulfillment updates.
    *   Your Firebase Function, upon detecting a new shipment in ShipStation, would call this webhook.

2.  **Refine `fulfillOrder` Action (`src/app/actions.ts`):**
    *   Ensure the `fulfillOrder` action correctly processes the data sent from the webhook.
    *   It should create the correct `out` movements in the inventory ledger.
    *   It should update the status of the corresponding order (fetched from ShipStation) within LedgerBloom's view of the data.

This phased approach will allow us to build and test the integration incrementally.
