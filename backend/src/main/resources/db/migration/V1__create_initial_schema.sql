-- =============================================================================
-- Restaurant Bill Generator & Management System
-- Schema Migration V1: Initial Tables and Relationships
-- =============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(32) NOT NULL, -- ADMIN, CASHIER, KITCHEN_STAFF
    email VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(500),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_menu_item_category FOREIGN KEY (category_id) REFERENCES menu_categories (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_menu_items_category ON menu_items (category_id);
CREATE INDEX idx_menu_items_available ON menu_items (is_available, is_archived);

-- 4. Restaurant Tables Table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    seating_capacity INT NOT NULL DEFAULT 4,
    section VARCHAR(50) NOT NULL DEFAULT 'Main Dining',
    status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, OCCUPIED, RESERVED, OUT_OF_SERVICE
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    total_visits INT NOT NULL DEFAULT 0,
    total_spent DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_customers_phone ON customers (phone);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    order_type VARCHAR(32) NOT NULL DEFAULT 'DINE_IN', -- DINE_IN, TAKEAWAY, DELIVERY
    table_id BIGINT,
    customer_id BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED', -- CREATED, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
    notes TEXT,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_table FOREIGN KEY (table_id) REFERENCES restaurant_tables (id) ON DELETE SET NULL,
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL,
    CONSTRAINT fk_order_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    line_total DECIMAL(12, 2) NOT NULL,
    notes VARCHAR(255),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- 8. Bills Table
CREATE TABLE IF NOT EXISTS bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL UNIQUE,
    cashier_id BIGINT,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'NONE', -- NONE, PERCENTAGE, FIXED
    discount_value DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    taxable_amount DECIMAL(12, 2) NOT NULL,
    cgst_rate DECIMAL(5, 2) NOT NULL DEFAULT 2.50,
    cgst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    sgst_rate DECIMAL(5, 2) NOT NULL DEFAULT 2.50,
    sgst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_tax DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    balance_amount DECIMAL(12, 2) NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'UNPAID', -- UNPAID, PARTIALLY_PAID, PAID, REFUNDED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bills_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
    CONSTRAINT fk_bills_cashier FOREIGN KEY (cashier_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_bills_payment_status ON bills (payment_status);
CREATE INDEX idx_bills_created_at ON bills (created_at);

-- 9. Bill Items Snapshot Table
CREATE TABLE IF NOT EXISTS bill_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    menu_item_id BIGINT,
    item_name VARCHAR(150) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL,
    line_total DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 5.00,
    CONSTRAINT fk_bill_items_bill FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_bill_items_bill ON bill_items (bill_id);

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL, -- CASH, UPI, CARD, OTHER
    transaction_reference VARCHAR(100),
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, FAILED, REFUNDED
    processed_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_bill FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE RESTRICT,
    CONSTRAINT fk_payments_user FOREIGN KEY (processed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_payments_bill ON payments (bill_id);
CREATE INDEX idx_payments_method ON payments (payment_method);
CREATE INDEX idx_payments_created_at ON payments (created_at);

-- 11. Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    payment_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    processed_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refunds_bill FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE RESTRICT,
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE RESTRICT,
    CONSTRAINT fk_refunds_user FOREIGN KEY (processed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Ingredients Table
CREATE TABLE IF NOT EXISTS ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit VARCHAR(20) NOT NULL, -- kg, g, l, ml, pcs
    current_stock DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    min_threshold DECIMAL(12, 2) NOT NULL DEFAULT 5.00,
    unit_cost DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    supplier VARCHAR(100),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Menu Item Recipes Table
CREATE TABLE IF NOT EXISTS menu_item_recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    quantity_required DECIMAL(12, 3) NOT NULL,
    CONSTRAINT fk_recipes_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE CASCADE,
    CONSTRAINT fk_recipes_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE RESTRICT,
    CONSTRAINT uq_recipe_menu_ingredient UNIQUE (menu_item_id, ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Inventory Movements Table
CREATE TABLE IF NOT EXISTS inventory_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ingredient_id BIGINT NOT NULL,
    movement_type VARCHAR(32) NOT NULL, -- INWARD_PURCHASE, OUTWARD_CONSUMPTION, ADJUSTMENT_WASTAGE, ADJUSTMENT_RETURN
    quantity DECIMAL(12, 3) NOT NULL,
    previous_stock DECIMAL(12, 3) NOT NULL,
    new_stock DECIMAL(12, 3) NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movements_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_movements_ingredient ON inventory_movements (ingredient_id);
CREATE INDEX idx_movements_created_at ON inventory_movements (created_at);

-- 15. Restaurant Settings Table
CREATE TABLE IF NOT EXISTS restaurant_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
