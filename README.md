# The Grand Spice Kitchen & Lounge — Restaurant Bill Generator and Management System

A production-style, full-stack Restaurant Billing and Management System built with **Spring Boot 3.4.3**, **MySQL 8.x**, and **React 18 + TypeScript + Vite + Tailwind CSS**.

---

## 🌟 Key Features

1. **POS Billing Terminal**:
   - Visual dish catalog with culinary food photography and dietary badges (Veg / Non-Veg).
   - Dynamic cart with Dine-In table selection, Takeaway, and Delivery order modes.
   - Dynamic discounts (% Percentage or ₹ Fixed) and automated 5% GST tax computation (`BigDecimal` precision).
2. **Thermal & OpenPDF Invoices**:
   - Printable 80mm thermal receipt formatted with GSTIN, itemized rates, cashier name, and barcode.
   - One-click server-side OpenPDF invoice download.
3. **Kitchen Display System (KDS)**:
   - Live kanban order queue auto-refreshing every 10 seconds for kitchen staff.
   - 1-click status advances (`CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`).
4. **Table & Floor Management**:
   - Visual floor plan tracking occupancy across dining sections (Main Dining, AC Lounge, Garden Patio, Rooftop).
5. **Inventory & Recipe Auto-Deduction**:
   - Raw ingredient tracking with low-stock warnings and inward purchase/wastage adjustment ledgers.
6. **Financial Reports & Analytics**:
   - Daily gross sales, discounts, and GST collections with Recharts area & pie graphs.
   - CSV spreadsheet export for accounting audits.
7. **Customer Directory & Loyalty**:
   - Diner profiles with visit frequency, lifetime spend, and past order history.
8. **Contactless Public QR Menu**:
   - Mobile-responsive digital menu accessible at `/qr-menu?table=T-01` with "Call Waiter" support.

---

## 🏗️ Technology Stack

- **Backend**:
  - Java 21 / 25
  - Spring Boot 3.4.3
  - Spring Data JPA / Hibernate 6
  - Flyway Database Migrations
  - Spring Security 6 + JJWT 0.12.6
  - OpenPDF 2.0.3 (PDF Receipt Generation)
  - Springdoc OpenAPI 2.8.5 (Swagger UI)
  - Maven Wrapper (`mvnw`)
- **Frontend**:
  - React 18.3 + TypeScript 5.7
  - Vite 6.1
  - Tailwind CSS 3.4
  - Recharts 2.15
  - Lucide React Icons
  - Axios with JWT Interceptor
- **Database**:
  - MySQL 8.x (`restaurant_billing_db`)

---

## 👥 Default Demo Credentials

| Role | Username | Password | Default Landing Page |
|---|---|---|---|
| **Administrator** | `admin` | `Admin@123` | Executive Dashboard (`/`) |
| **Cashier** | `cashier` | `Cashier@123` | POS Terminal (`/pos`) |
| **Kitchen Chef** | `chef` | `Chef@123` | Kitchen KDS Screen (`/kitchen`) |

*(Use the quick-fill buttons on the login screen for instant demo access).*

---

## 🚀 Quick Start Guide

### Prerequisites
- JDK 21+ installed and configured on `PATH`
- Node.js 18+ and `npm` installed
- MySQL 8.0 running on port `3306` with credentials `root / root` (or configure in `backend/src/main/resources/application.yml`)

---

### Option 1: Running Locally (Windows PowerShell)

#### Step 1: Initialize Database
```powershell
# Create database in MySQL if not present
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS restaurant_billing_db;"
```

#### Step 2: Start Spring Boot Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
*Backend starts on `http://localhost:8080`. Flyway automatically runs database migrations (`V1` schema and `V2` initial seeds).*

#### Step 3: Start React Frontend
```powershell
cd frontend
npm install
npm run dev
```
*Frontend opens on `http://localhost:5173`.*

---

### Option 2: Running with Docker Compose

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend REST API: `http://localhost:8080/api`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui/index.html`

---

## 🧪 Running Automated Tests

To execute the backend service and integration test suites:
```powershell
cd backend
.\mvnw.cmd test
```

To build and validate the frontend production bundle:
```powershell
cd frontend
npm run build
```

---

## 📂 Documentation Links

- [Database Design & ER Diagram](file:///c:/Users/vatti/OneDrive/Desktop/Restaurant-bill-generator/docs/database-design.md)
- [REST API Endpoint Specification](file:///c:/Users/vatti/OneDrive/Desktop/Restaurant-bill-generator/docs/api-documentation.md)
- [Screenshots & UI Walkthrough](file:///c:/Users/vatti/OneDrive/Desktop/Restaurant-bill-generator/docs/screenshots-guide.md)
