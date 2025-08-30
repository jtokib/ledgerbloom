# LedgerBloom - Project TODO

Here is a list of features based on the project requirements.

---

## SECURITY HOTFIX SPRINT #1

**Goal:** Remediate the critical security vulnerabilities identified in the recent security review.

- [ ] **Implement Granular Firestore Security Rules:** Overhaul the current `firestore.rules` to enforce strict, server-side data validation and role-based access control for all collections. This is the most critical fix.

---

## Sprint 9: Advanced Order Management & Deeper AI Integration

**Goal:** Overhaul the order management system to include line items and integrate AI to assist in the order creation process.

*   **Advanced Order Creation:**
    *   [ ] **Add Line Item Management:** Enhance the "Create Order" and "Edit Order" dialogs to allow users to add, edit, and remove line items (products and quantities).
    *   [ ] **Update Order Value Calculation:** Automatically calculate the total value of an order based on its line items. This will require adding a `price` field to the `Product` or `Variant` models.
*   **AI-Assisted Order Entry:**
    *   [ ] **Create a `suggestOrderItems` Flow:** Build a new Genkit flow that takes a natural language description (e.g., "a dozen roses and a small box of chocolates") and returns a structured list of order items (SKUs and quantities) based on the available products.
    *   [ ] **Integrate AI into Order Dialog:** Add a feature to the "Create Order" dialog that allows users to generate line items automatically from a text description using the new AI flow.


---

## Completed Tasks

- **Sprint 8: Advanced AI & UI Refinements**
    - [x] **Live AI Insights:**
        - [x] **Integrate Live Data:** Modified the AI Insights page to use live inventory and movement data directly from Firestore instead of requiring the user to paste it.
        - [x] **Create a `getLiveInventoryData` Tool:** Developed a Genkit tool that can be used by flows to fetch and summarize the current inventory state, making it easier for the AI to reason about the data.
    - [x] **UI Enhancements:**
        - [x] **Implement Search/Filtering:** Added search and filtering capabilities to the main data tables (Products, Locations, Orders, Movements) to allow users to find information more quickly.
        - [x] **Form Validation:** Introduced more robust client-side form validation using a library like `zod` to provide immediate feedback to users and improve data integrity.

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