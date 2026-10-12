# User Interface & Operations Visual Walkthrough

This guide provides an overview of the key screens and operational workflows in **The Grand Spice Kitchen & Lounge POS**.

---

## 1. Login & Role Selector (`/login`)
- **Visual Design**: Sleek gradient glassmorphism card with dark backdrop.
- **Features**: One-click quick-fill buttons for demo profiles:
  - **Admin**: `admin` / `Admin@123` (Full system access)
  - **Cashier**: `cashier` / `Cashier@123` (POS Billing & Bills)
  - **Kitchen Chef**: `chef` / `Chef@123` (KDS Live Screen)

---

## 2. Executive Analytics Dashboard (`/`)
- **Key Metrics**: Today's Sales, Orders Count, Finalized Bills, Average Order Value, Pending Kitchen Load, Low Stock Count.
- **Charts**:
  - Recharts Area Chart displaying daily gross sales trends.
  - Pie Chart showing tender breakdown across Cash, UPI, Card, and Other.
  - Ranking cards for Top 5 Best-Selling Dishes.
  - Real-time recent orders table with fast action links.

---

## 3. POS Billing Console (`/pos`)
- **Order Modes**: Dine-In (with table selector), Takeaway, and Delivery.
- **Menu Catalog**:
  - Category tabs and search bar.
  - Veg and Non-Veg dietary toggles.
  - Food photography cards with 1-click counter buttons.
- **Live Cart Panel**:
  - Subtotal, 5% GST calculation, dynamic discount modal (% percentage or ₹ fixed).
  - "Place Order" button sends tickets directly to the kitchen.
  - "Bill & Pay" button immediately finalizes invoices, collects payment tender, and opens thermal receipt print dialog.

---

## 4. Kitchen Display System - KDS (`/kitchen`)
- **Auto-polling**: Silently checks for new incoming tickets every 10 seconds.
- **Kanban Flow**:
  - **Queued Orders** (`CONFIRMED`) with elapsed timer.
  - **In Kitchen** (`PREPARING`) with recipe and customization notes.
  - **Ready to Serve** (`READY`) for waiter or customer pickup.

---

## 5. Thermal Receipt & OpenPDF Invoicing (`/bills`)
- **Thermal Print**: Formatted for 80mm ESC/POS thermal printers with restaurant branding, GSTIN, itemized rates, tax breakup, and barcode/bill ID.
- **Download PDF**: OpenPDF server-generated downloadable vector PDF invoice.
