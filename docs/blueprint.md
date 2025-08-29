# **App Name**: LedgerBloom

## Core Features:

- Ledger-Based Inventory Tracking: Implement a ledger system for tracking all inventory movements, ensuring an audit trail. Records include SKU, location, quantity, direction, cause, and timestamp.
- Inventory Level Calculation: Automatically update materialized inventory levels based on inventory movements. Calculate current quantity, unit of measure and updated at fields, to create an instantaneous view of stock levels.
- AI-Driven Insights: Offer a 'tool' that processes inventory data to provide suggestions for adjustments and optimization strategies using generative AI.
- Product & Location Management: Enable users to create products with variants and manage warehouse locations, tracking essential details such as product name, SKU, unit of measure, and location address.
- Data Export to BigQuery: Provide real-time or scheduled export of inventory and transactional data to BigQuery for advanced analytics and reporting. Ensure audit trails of exports as a system function.
- Audit Logs: Record and retain a detailed audit trail for data access and modifications, user actions, configuration changes, system events, and security-related events. All actions must be attributed to a user or a service account.

## Style Guidelines:

- Primary color: Forest green (#386641) to convey growth, stability, and a connection to nature, which is suitable for an inventory management system focused on ‘Mr Bloom’.
- Background color: Light beige (#F5F3E3), providing a soft and neutral backdrop that complements the forest green.
- Accent color: Terracotta (#BC6C25), which offers an earthy tone, evoking a sense of heritage, stability and reliability while still being different enough from the primary to establish hierarchy.
- Headline font: 'Playfair' (serif) for an elegant, fashionable feel; pairing with PT Sans for longer text.
- Body font: 'PT Sans' (sans-serif) for body text.  Note: currently only Google Fonts are supported.
- Use minimalist, line-style icons related to inventory, products, and locations.
- A clean, well-organized layout with intuitive navigation and clear data presentation. Incorporate a dashboard for an overview of inventory status, stock levels, and insights.