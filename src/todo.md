
# LedgerBloom - Project TODO

Here is a list of features based on the project requirements.

---

## Sprint 8: Advanced AI & UI Refinements

**Goal:** Enhance the AI capabilities to provide proactive insights based on live data and refine the user interface with advanced search and filtering.

*   **Live AI Insights:**
    *   [x] **Integrate Live Data:** Modify the AI Insights page to use live inventory and movement data directly from Firestore instead of requiring the user to paste it.
    *   [x] **Create a `getLiveInventoryData` Tool:** Develop a Genkit tool that can be used by flows to fetch and summarize the current inventory state, making it easier for the AI to reason about the data.
*   **UI Enhancements:**
    *   [x] **Implement Search/Filtering:** Add search and filtering capabilities to the main data tables (Products, Locations, Orders, Movements) to allow users to find information more quickly.
    - [x] **Form Validation:** Introduce more robust client-side form validation using a library like `zod` to provide immediate feedback to users and improve data integrity.

---

## Completed Tasks

- **Sprint 7: User Management & Collaboration**
    - [x] **Implement Invitation Flow:** Created a system for admins to invite new users to the organization via email.
    - [x] **Build Invitation UI:** Enabled the "Invite Member" button on the settings page and created a dialog for sending invitations.
    - [x] **Edit User Roles:** Allowed admins to change the role of existing members.
    - [x] **Remove Users:** Allowed admins to remove members from the organization.
    - [x] **List Organization Members:** The "Members" tab on the settings page now displays a list of all users.

- **Sprint 6: Dashboard & Product Enhancements**
    - [x] **Dashboard Improvements:**
        - [x] **Dynamic Chart Data:** Replaced the static dashboard chart with one that displays real sales and purchase data from the last 30 days.
        - [x] **Recent Activity Feed:** Added a component to the dashboard that shows the 5 most recent inventory movements.
    - [x] **Product Variant Management:**
        - [x] **Add/Edit Variants:** Implemented UI for adding and editing product variants.
        - [x] **Display Variants:** Showed a product's variants in a collapsible section.
    - [x] **UI Polish:**
        - [x] **Empty States:** Added helpful "empty state" messages to tables when there is no data to display.

- **Sprint 5: Advanced Features & Auditing**
    - [x] **Audit Logs:** Implemented a comprehensive audit trail for all major CUD operations.
    - [x] **Data Export to BigQuery:** Implemented a simulated data export flow to BigQuery, with clear placeholders for final implementation.

- **Sprint 4: RBAC and Core Features**
    - [x] **Role-Based Access Control (RBAC):** Implemented user roles and protected UI/actions.
    - [x] **Order Management:** Implemented full CRUD for customer orders.
    - [x] **Advanced Features:** Implemented product image uploads and pagination.

- **Sprint 3: Audit & Refactor**
    - [x] **Critical Security Fix (DB-001):** Migrated all database write operations to secure server actions.
    - [x] **Initial Security Rules (MISS-005):** Established baseline security rules.
    - [x] **User Signup & Profile Management:** Implemented user registration and profile updates.

- **Sprint 2: Core Functionality**
    - [x] **Product & Location Management (U & D):** Implemented Update and Delete for products/locations.
    - [x] **Ledger-Based Inventory Tracking:** Implemented a ledger system for all inventory movements.
    - [x] **Inventory Level Calculation:** Automatically calculated inventory levels from movements.

- **Sprint 1: Initial Setup**
    - [x] **Initial UI for Core Features:** Implemented basic pages for Inventory, Products, and Locations.
    - [x] **AI-Driven Insights:** Implemented the initial AI insights page.
    - [x] **Product & Location Management (C):** Added `Create` functionality for products and locations.
    - [x] **Mock Data Services:** Established initial data services.


    