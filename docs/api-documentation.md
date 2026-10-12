# REST API Specification & Endpoint Directory

Base URL: `http://localhost:8080/api`  
Interactive OpenAPI / Swagger UI: `http://localhost:8080/swagger-ui/index.html`  
OpenAPI JSON Schema: `http://localhost:8080/v3/api-docs`

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates credentials and issues signed JWT bearer token |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile & permissions |

### Login Request Example
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

---

## 2. Menu & Categories (`/api/categories`, `/api/menu-items`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | Returns active category hierarchy |
| `POST` | `/api/categories` | `ADMIN` | Creates new food category |
| `GET` | `/api/menu-items` | Public | Fetches all active dishes and prices |
| `POST` | `/api/menu-items` | `ADMIN` | Adds new menu dish |
| `PUT` | `/api/menu-items/{id}` | `ADMIN` | Updates dish details and pricing |
| `PATCH` | `/api/menu-items/{id}/availability?isAvailable=true` | `ADMIN`, `KITCHEN_STAFF` | Toggles kitchen stock state |
| `DELETE` | `/api/menu-items/{id}` | `ADMIN` | Soft-archives menu item |

---

## 3. Order Management (`/api/orders`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/orders` | Authenticated | Lists all restaurant orders with filters |
| `GET` | `/api/orders/{id}` | Authenticated | Retrieves order by ID |
| `POST` | `/api/orders` | `ADMIN`, `CASHIER` | Creates new Dine-In, Takeaway, or Delivery order |
| `PATCH` | `/api/orders/{id}/status?status=...` | Authenticated | Transitions order lifecycle (`CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`) |

---

## 4. Billing & Tax Invoices (`/api/bills`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bills` | Authenticated | Returns all generated bills and payment statuses |
| `GET` | `/api/bills/{id}` | Authenticated | Retrieves bill with itemized rate snapshot |
| `POST` | `/api/bills` | `ADMIN`, `CASHIER` | Generates official tax invoice with discounts and 5% GST |
| `GET` | `/api/bills/{id}/pdf` | Authenticated | Generates and streams downloadable OpenPDF receipt |

---

## 5. Payments & Settlements (`/api/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/payments/bill/{billId}` | Authenticated | Lists all payment transactions for a given bill |
| `POST` | `/api/payments/bill/{billId}` | `ADMIN`, `CASHIER` | Records tender (`CASH`, `UPI`, `CARD`, `OTHER`) |

---

## 6. Kitchen Display System (`/api/kitchen`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/kitchen/orders` | `ADMIN`, `KITCHEN_STAFF` | Live queue of queued, cooking, and ready orders |
| `PATCH` | `/api/kitchen/orders/{id}/status?status=...` | `ADMIN`, `KITCHEN_STAFF` | 1-click status forward in kitchen |

---

## 7. Inventory & Recipe Auto-Deduction (`/api/inventory`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/inventory/ingredients` | `ADMIN` | Ingredient stock levels and low-stock indicators |
| `POST` | `/api/inventory/ingredients` | `ADMIN` | Adds new raw material item |
| `POST` | `/api/inventory/movements` | `ADMIN` | Logs stock adjustment (Purchase, Wastage, Return) |
| `GET` | `/api/inventory/movements` | `ADMIN` | Full historical stock ledger |

---

## 8. Financial Reports (`/api/reports`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/sales?days=30` | `ADMIN` | Daily sales, gross revenue, discounts, and GST collection |
| `GET` | `/api/reports/sales/csv?days=30` | `ADMIN` | Streams downloadable CSV audit spreadsheet |
| `GET` | `/api/reports/top-selling?days=30` | `ADMIN` | Dish ranking by revenue and unit velocity |
| `GET` | `/api/reports/payment-methods?days=30` | `ADMIN` | Payment method breakdown |
