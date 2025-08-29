# LedgerBloom - Project TODO

Here is a list of features based on the project requirements.

---

## Sprint 3: Advanced Features & Auditing

**Goal:** Implement advanced features for data export and create a comprehensive audit trail for all system activities.

- [x] **Data Export to BigQuery:** 
    - [x] Provide real-time or scheduled export of inventory and transactional data.
    - [x] Ensure audit trails of exports as a system function.
- [x] **Audit Logs:** 
    - [x] Record and retain a detailed audit trail for data access and modifications.
    - [x] Track user actions, configuration changes, system events, and security-related events.
    - [x] Ensure all actions are attributed to a user or a service account.

---

## Future Sprints (Backlog)

*No items in the backlog currently.*

---

## Completed Tasks

- **Sprint 2:**
    - [x] **Fix UI Spacing and Scrolling:**
        - [x] Removed large empty space at the top of the page.
        - [x] Enabled y-axis scrolling for tablet and desktop viewports.
    - [x] **Product & Location Management (U & D):**
        - [x] Implemented Update and Delete functionality for products.
        - [x] Implemented Update and Delete functionality for locations.
    - [x] **Ledger-Based Inventory Tracking:** 
        - [x] Implemented a ledger system for tracking all inventory movements.
        - [x] Records include SKU, location, quantity, direction, cause, and timestamp.
    - [x] **Inventory Level Calculation:** 
        - [x] Automatically updated materialized inventory levels based on inventory movements. 
        - [x] Calculated current quantity, unit of measure and updated at fields.

- **Sprint 1:**
    - [x] **Initial UI for Core Features:**
        - [x] Implemented basic pages for Inventory, Products, and Locations.
    - [x] **AI-Driven Insights:**
        - [x] Implemented AI insights page with Genkit flow.
    - [x] **Product & Location Management (C):**
        - [x] Added `Create` functionality for products and locations.
    - [x] **Mock Data Services:**
        - [x] Established mock data services for `READ` operations.
