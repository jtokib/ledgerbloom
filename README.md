# LedgerBloom: AI-Powered Inventory Management System

LedgerBloom is a modern, web-based inventory management application designed to provide businesses with a robust, auditable, and intelligent platform for tracking their stock. Built with Next.js, Firebase, and Google's Genkit AI, the application offers a ledger-based system to ensure every inventory movement is recorded, providing a clear and accurate audit trail.

The system moves beyond simple stock counting by integrating generative AI to offer actionable insights and optimization strategies. From managing products and warehouse locations to creating and fulfilling orders, LedgerBloom provides a comprehensive suite of tools for efficient inventory control, all presented in a clean, professional, and user-friendly interface.

---

## Table of Contents

1.  [Key Features](#key-features)
2.  [Technology Stack](#technology-stack)
3.  [System Architecture](#system-architecture)
4.  [Setup and Installation](#setup-and-installation)
5.  [API Reference](#api-reference)
6.  [File Structure and Documentation](#file-structure-and-documentation)
7.  [License](#license)

---

## Key Features

-   **Ledger-Based Inventory Tracking:** Every stock movement is recorded as an immutable ledger entry, ensuring a complete and auditable history.
    -   *Implementation:* `src/services/movements.ts`, `src/app/dashboard/movements/page.tsx`
-   **Automated Inventory Level Calculation:** Current stock levels are calculated in real-time based on the movement ledger, providing an instantaneous view of inventory.
    -   *Implementation:* `src/services/inventory.ts`, `src/app/dashboard/inventory/page.tsx`
-   **AI-Driven Insights:** A Genkit-powered tool analyzes live inventory data to provide actionable suggestions for optimization and efficiency improvements.
    -   *Implementation:* `src/ai/flows/inventory-optimization-suggestions.ts`, `src/app/dashboard/ai-insights/page.tsx`
-   **Product & Location Management:** A full CRUD interface for managing products, their variants (including pricing and SKUs), and physical locations like warehouses or stores.
    -   *Implementation:* `src/app/dashboard/products/page.tsx`, `src/app/dashboard/locations/page.tsx`, `src/app/actions.ts`
-   **Advanced Order Management:** Create and manage customer orders with detailed line items. The system supports various order statuses and integrates with the inventory ledger upon fulfillment.
    -   *Implementation:* `src/app/dashboard/orders/page.tsx`, `src/components/orders/add-order-dialog.tsx`
-   **AI-Assisted Order Entry:** A Genkit flow that uses natural language processing to parse order descriptions and automatically suggest line items, speeding up order creation.
    -   *Implementation:* `src/ai/flows/suggest-order-items.ts`, `src/components/orders/add-order-dialog.tsx`
-   **Role-Based Access Control (RBAC):** A secure user management system with 'admin', 'manager', and 'viewer' roles to control access to features and data.
    -   *Implementation:* `src/hooks/use-role.ts`, `src/app/dashboard/settings/page.tsx`, server actions in `src/app/actions.ts`
-   **Data Export Simulation:** A feature to simulate exporting inventory and movement data to Google BigQuery for advanced analytics.
    -   *Implementation:* `src/ai/flows/export-to-bigquery.ts`, `src/app/dashboard/reports/page.tsx`
-   **Comprehensive Audit Logging:** Automatically records all significant user and system actions, providing a detailed and searchable audit trail.
    -   *Implementation:* `src/services/audit.ts`, `src/app/dashboard/audit-log/page.tsx`
-   **Webhook for External Integrations:** A secure webhook endpoint to allow external systems (like ShipStation) to trigger order fulfillments.
    -   *Implementation:* `src/app/api/webhooks/shipstation/route.ts`

---

## Technology Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Firebase Authentication, Storage)
-   **Generative AI:** [Genkit (Google's AI Toolkit)](https://firebase.google.com/docs/genkit)
-   **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## System Architecture

LedgerBloom is architected as a server-driven Next.js application.

-   **Frontend:** The UI is built with React components and leverages the Next.js App Router. Most pages are client-rendered (`'use client'`) to provide an interactive experience, while fetching initial data via server-side services.
-   **Backend Logic:** All database mutations (Create, Update, Delete) and sensitive operations are handled exclusively through Next.js **Server Actions** (`src/app/actions.ts`). This ensures that business logic and data access rules are enforced on the server, providing a critical layer of security.
-   **Database:** Firestore is the primary database, storing all application data. Access to Firestore from the client is limited, with writes being funneled through secure server actions. Firestore Security Rules provide a second layer of defense.
-   **Authentication:** Firebase Authentication handles user identity and session management. A custom `useRole` hook integrates with the `users` collection in Firestore to provide role-based access control throughout the application.
-   **AI Integration:** Generative AI features are implemented using Genkit. AI "flows" are defined on the server (`src/ai/flows/`) and are exposed to the frontend via dedicated server actions.

---

## Setup and Installation

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A Firebase project with Firestore, Firebase Authentication (Email/Password and Google providers enabled), and Cloud Storage enabled.

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ledgerbloom-app
    ```

2.  **Configure Firebase:**
    -   Copy your Firebase project's web configuration object into `src/lib/firebase.ts`. **Note:** The API key will be loaded from an environment variable.
    -   Set up Application Default Credentials for the server-side Firebase Admin SDK. You can do this by running `gcloud auth application-default login` if you have the gcloud CLI installed.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project. This file is for local development and should not be committed to version control. Add the following keys:
    ```
    # Your public Firebase project API key
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here

    # Your Google Cloud / Gemini API Key for Genkit
    GEMINI_API_KEY=your_gemini_api_key_here

    # A secret key for securing the ShipStation webhook
    SHIPSTATION_WEBHOOK_API_KEY=your_secret_api_key_here
    ```

5.  **Run the development server:**
    The application requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

    -   **Terminal 1: Run the Next.js app:**
        ```bash
        npm run dev
        ```
        This will start the main application on `http://localhost:9002`.

    -   **Terminal 2: Run the Genkit development server:**
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit server, which makes the AI flows available to the application.

---

## API Reference

### Webhooks

#### **`POST /api/webhooks/shipstation`**

-   **Purpose:** Receives fulfillment notifications from an external service (like a custom ShipStation proxy). This endpoint triggers the order fulfillment process within LedgerBloom, creating the necessary inventory movements.
-   **Authentication:** `Bearer Token`. The request must include an `Authorization` header with a bearer token that matches the `SHIPSTATION_WEBHOOK_API_KEY` environment variable.
-   **Request Body:**

    ```json
    {
      "orderId": "string",
      "items": [
        {
          "sku": "string",
          "quantity": "number"
        }
      ],
      "actor": "string (optional)"
    }
    ```

-   **Responses:**
    -   `200 OK`: Fulfillment processed successfully.
    -   `400 Bad Request`: The request body is missing or malformed, or the order could not be fulfilled due to a business logic error (e.g., order not found).
    -   `401 Unauthorized`: The `Authorization` header is missing or the token is invalid.
    -   `500 Internal Server Error`: An unexpected error occurred on the server.

---

## File Structure and Documentation

This section provides a detailed breakdown of the most important files and directories in the project.

### `/src/app` - Routing & Pages

This directory contains the application's UI pages and layouts, following the Next.js App Router convention.

#### `/src/app/dashboard/layout.tsx`

-   **Purpose:** Defines the main layout for the authenticated part of the application.
-   **Key Components:** `DashboardLayout`
-   **Dependencies:** `SidebarNav`, `DashboardHeader`
-   **Logic Breakdown:** This file sets up the primary visual structure of the dashboard, including the persistent sidebar and header. It wraps all dashboard pages, providing a consistent user experience.

#### `/src/app/actions.ts`

-   **Purpose:** The central file for all **Server Actions**. It contains all functions that mutate server-side data or perform sensitive operations.
-   **Key Functions:** `createProduct`, `updateUserRole`, `deleteLocation`, `createOrder`, `fulfillOrder`, `generateSuggestions`, etc.
-   **Dependencies:** All services in `/src/services`, all AI flows in `/src/ai/flows`.
-   **Logic Breakdown:** This file is the bridge between the client-side UI and the server-side logic. Each function is a secure endpoint that can be called directly from client components. It's responsible for orchestrating calls to database services, creating audit logs, and revalidating Next.js cache paths (`revalidatePath`) to update the UI.

### `/src/ai` - Artificial Intelligence

This directory contains all code related to the Generative AI features powered by Genkit.

#### `/src/ai/genkit.ts`

-   **Purpose:** Initializes and configures the global Genkit `ai` instance.
-   **Key Components:** `ai` (Genkit instance)
-   **Dependencies:** `genkit`, `@genkit-ai/googleai`
-   **Logic Breakdown:** This file sets up the connection to Google's AI models (Gemini) and exports a singleton `ai` object that is used by all other Genkit flows and tools in the application.

#### `/src/ai/flows/inventory-optimization-suggestions.ts`

-   **Purpose:** Defines the AI flow for generating inventory optimization suggestions.
-   **Key Functions/Tools:** `getInventoryOptimizationSuggestions`, `getLiveInventoryData` (tool)
-   **Dependencies:** `genkit`, `zod`, `getInventoryLevels`, `getMovements`
-   **Logic Breakdown:** The flow defines a tool (`getLiveInventoryData`) that the AI can call to fetch current inventory data. The main prompt instructs the AI to use this tool and then analyze the data to provide actionable suggestions.

#### `/src/ai/flows/suggest-order-items.ts`

-   **Purpose:** Defines the AI flow for suggesting order items from a natural language prompt.
-   **Key Functions/Tools:** `suggestOrderItems`, `getAvailableProducts` (tool)
-   **Dependencies:** `genkit`, `zod`, `getProducts`
-   **Logic Breakdown:** This flow uses a tool (`getAvailableProducts`) to give the AI knowledge of the product catalog. The prompt instructs the AI to match a user's text description (e.g., "a bag of bee mix") to specific product variants and return a structured list of SKUs and quantities.

### `/src/services` - Data Services

This directory contains modules responsible for all direct database interactions, abstracting Firestore logic from the rest of the application.

#### `/src/services/inventory.ts`

-   **Purpose:** Calculates the current inventory levels.
-   **Key Functions:** `getInventoryLevels`
-   **Dependencies:** `getMovements`
-   **Logic Breakdown:** This service does not read from a dedicated `inventory_levels` collection. Instead, it calculates the current stock levels on-the-fly by fetching all movements from the `movements` service and aggregating them. This ensures the inventory is always perfectly in sync with the ledger.

#### `/src/services/audit.ts`

-   **Purpose:** Manages reading from and writing to the `audit_logs` collection.
-   **Key Functions:** `getAuditLogs`, `createAuditLog`
-   **Dependencies:** `firebase/firestore`, `db`
-   **Logic Breakdown:** Provides simple, reusable functions to fetch a sorted list of all audit logs or to create a new one. This service is called from `actions.ts` after any significant operation.

#### `/src/services/users.ts`, `products.ts`, `locations.ts`, `orders.ts`, etc.

-   **Purpose:** These files provide standard CRUD (Create, Read, Update, Delete) operations for their respective Firestore collections.
-   **Dependencies:** `firebase/firestore`, `db`
-   **Logic Breakdown:** Each service handles the logic for fetching data (often with pagination), creating, updating, and deleting documents in its specific collection. They abstract away the raw Firestore queries.

### `/src/components` - UI Components

This directory contains all reusable React components, organized by feature or UI pattern.

#### `/src/components/orders/add-order-dialog.tsx`

-   **Purpose:** A complex dialog component for creating a new customer order.
-   **Key Components:** `AddOrderDialog`
-   **Dependencies:** `react`, `lucide-react`, ShadCN components, `suggestItemsForOrder` action.
-   **Logic Breakdown:** This component demonstrates the integration of multiple systems. It fetches all available products to populate a manual selection dropdown. It also features a textarea that calls the `suggestItemsForOrder` AI flow to automatically populate the order's line items. The component manages the state of the line items locally before submitting the final order object to the `createOrder` server action.

#### `/src/components/dashboard/sidebar-nav.tsx`

-   **Purpose:** Renders the main navigation sidebar for the dashboard.
-   **Key Components:** `SidebarNav`
-   **Dependencies:** `next/link`, `next/navigation`, `lucide-react`, `useSidebar`
-   **Logic Breakdown:** Maps over a configuration array (`menuItems`) to render the navigation links. It uses the `usePathname` hook to determine the currently active link and apply the correct styling.

---

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.
