# **App Name**: LedgerBloom

## Core Features:

- Multi-Tenant Architecture: Ensures data isolation and access control based on organization ID. Implements Firebase Auth custom claims to store user's organization ID and role for secure and efficient data retrieval. Falls back to 'sandbox' organization with limited features if organization ID is missing, for development purposes.
- Component & Kit Management: Enables businesses to manage individual product components and combine them into kits with defined quantities. Each product variant (SKU) has its own pricing and packaging configurations, with kit explosion into component movements upon sale.
- Ledger-Based Inventory System: Records immutable movements as append-only entries, providing an auditable history of stock changes. Calculates current stock levels based on movement history, ensuring accuracy and transparency. Supports multiple warehouse locations per organization.
- Initial Inventory Setup: Provides a CSV upload interface with drag-and-drop functionality for bulk inventory import, supporting both individual SKUs and kit compositions. Includes data validation and preview to ensure accuracy before committing movements.
- ShipStation Integration: Integrates with ShipStation via webhook to manage order fulfillment, with idempotency handling to prevent duplicate processing. Manages the basic order lifecycle from pending to shipped to delivered, providing real-time updates and tracking.
- AI-Powered Insights: Uses Firebase Genkit to provide natural language querying and AI-driven insights for inventory optimization and predictive analytics. This is a tool that can give the user more information by querying the available data.

## Style Guidelines:

- Primary color: Forest Green (#386641) to convey a sense of nature, growth, and stability. In HSL, this hue is relatively dark, therefore it is most appropriate for a light color scheme.
- Background color: Light Beige (#F5F3E3), very close in hue to the forest green, but desaturated and bright to create a light and airy background.
- Accent color: Terracotta (#BC6C25), an analogous color to forest green, approximately 30 degrees to the left of green on the color wheel, significantly different from the primary color in brightness and saturation to create a high level of contrast.
- Headline font: 'Playfair', a modern sans-serif with an elegant, fashionable, high-end feel.
- Body font: 'PT Sans', a humanist sans-serif that combines a modern look and a little warmth or personality.
- Use clean, minimalist icons that align with the professional aesthetic, focusing on clarity and ease of understanding.
- Maintain a clean and minimalist layout, using white space effectively to create a professional and easy-to-navigate interface. Utilize the shadcn/ui components to ensure consistency and quality across all pages.