
# LedgerBloom - Project TODO

Here is a list of features based on the project requirements.

---

## Sprint 5: Advanced Features & Auditing

**Goal:** Implement advanced features like data exporting and comprehensive audit trails to enhance enterprise readiness.

- [ ] **Audit Logs:** 
    - [x] Create a new page and components for viewing audit logs.
    - [ ] Integrate `createAuditLog` into all write operations (CUD) for products, locations, orders, and movements.
    - [ ] Record and retain a detailed audit trail for data access and modifications.
    - [ ] Track user actions, configuration changes, system events, and security-related events.
    - [ ] Ensure all actions are attributed to a user or a service account.
- [ ] **Data Export to BigQuery:** 
    - [ ] Provide real-time or scheduled export of inventory and transactional data.
    - [ ] Ensure audit trails of exports as a system function.

---

## Completed Tasks

- **Sprint 4: RBAC and Core Features**
    - [x] **Role-Based Access Control (RBAC):**
        - [x] Create a `users` collection in Firestore to store user roles.
        - [x] Implement logic to check user roles for actions.
        - [x] Update Firestore security rules to enforce role-based permissions.
        - [x] Conditionally render UI elements based on user role.
    - [x] **Order Management:**
        - [x] Create pages and components for viewing and managing orders.
        - [x] Implement server actions for creating and updating orders.
        - [x] Update inventory when an order status changes (implemented via server action).
    - [x] **Advanced Features:**
        - [x] Implement product image uploads to Firebase Storage.
        - [x] Add pagination to all data tables to improve performance.

- **Sprint 3: Audit & Refactor**
    - [x] **Critical Security Fix (DB-001):** Migrated all database write operations from client-side services to secure, backend-only server actions.
    - [x] **Initial Security Rules (MISS-005):** Established baseline security rules to require authentication for all database access.
    - [x] **User Signup (AUTH-001):** Implemented a user registration page and form.
    - [x] **Dynamic Dashboard (UI-001):** Replaced hardcoded dashboard statistics with live data fetched from Firestore.
    - [x] **Profile Management (UI-003):** Enabled the "My Profile" section on the settings page, allowing users to update their name.
    - [x] **Performance Fix (PERF-001):** Converted the Reports page to a Server Component to improve initial load performance.
    - [x] **Layout Fixes:** Corrected multiple layout and scrolling issues.

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
