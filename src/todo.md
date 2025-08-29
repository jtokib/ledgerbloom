# LedgerBloom - Project TODO

Here is a list of features based on the project requirements.

---

## Sprint 2: Core Functionality

**Goal:** Solidify the core inventory management loop and complete the basic administrative CRUD operations.

- [x] **Fix UI Spacing and Scrolling:**
    - [x] Remove large empty space at the top of the page.
    - [x] Enable y-axis scrolling for tablet and desktop viewports.
- [x] **Product & Location Management (U & D):**
    - [x] Implement Update and Delete functionality for products.
    - [x] Implement Update and Delete functionality for locations.
- [x] **Ledger-Based Inventory Tracking:** 
    - [x] Implement a ledger system for tracking all inventory movements.
    - [x] Records must include SKU, location, quantity, direction, cause, and timestamp.
- [x] **Inventory Level Calculation:** 
    - [x] Automatically update materialized inventory levels based on inventory movements. 
    - [x] Calculate current quantity, unit of measure and updated at fields.

---

## Future Sprints (Backlog)

- [ ] **Data Export to BigQuery:** 
    - [ ] Provide real-time or scheduled export of inventory and transactional data.
    - [ ] Ensure audit trails of exports as a system function.
- [ ] **Audit Logs:** 
    - [ ] Record and retain a detailed audit trail for data access and modifications.
    - [ ] Track user actions, configuration changes, system events, and security-related events.
    - [ ] Ensure all actions are attributed to a user or a service account.

---

## Completed Tasks

- **Sprint 1:**
    - [x] Initial UI for Core Features (Inventory, Products, Locations).
    - [x] Implemented AI insights page with Genkit flow.
    - [x] Added `Create` functionality for products and locations.
    - [x] Established mock data services for `READ` operations.
