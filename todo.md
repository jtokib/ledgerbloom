# LedgerBloom - Sprint 1 TODO

Here is a list of features based on the project requirements.

## Core Features

- [ ] **Ledger-Based Inventory Tracking:** 
    - [ ] Implement a ledger system for tracking all inventory movements.
    - [ ] Records must include SKU, location, quantity, direction, cause, and timestamp.

- [ ] **Inventory Level Calculation:** 
    - [ ] Automatically update materialized inventory levels based on inventory movements. 
    - [ ] Calculate current quantity, unit of measure and updated at fields.

- [x] **AI-Driven Insights:** 
    - [x] Offer a 'tool' that processes inventory data to provide suggestions for adjustments and optimization strategies using generative AI.

- [ ] **Product & Location Management:**
    - [x] Enable users to create products with variants.
    - [x] Enable users to manage warehouse locations.
    - [ ] Implement Update and Delete functionality for products.
    - [ ] Implement Update and Delete functionality for locations.

- [ ] **Data Export to BigQuery:** 
    - [ ] Provide real-time or scheduled export of inventory and transactional data.
    - [ ] Ensure audit trails of exports as a system function.

- [ ] **Audit Logs:** 
    - [ ] Record and retain a detailed audit trail for data access and modifications.
    - [ ] Track user actions, configuration changes, system events, and security-related events.
    - [ ] Ensure all actions are attributed to a user or a service account.

## Completed Tasks

- **Sprint 1:**
    - [x] Initial UI for Core Features (Inventory, Products, Locations).
    - [x] Implemented AI insights page with Genkit flow.
    - [x] Added `Create` functionality for products and locations.
    - [x] Established mock data services for `READ` operations.
