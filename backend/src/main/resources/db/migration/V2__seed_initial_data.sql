-- =============================================================================
-- Restaurant Bill Generator & Management System
-- Schema Migration V2: Initial Seeds (Users, Categories, Menu, Tables, Stock)
-- =============================================================================

-- Initial Users (Password: Admin@123, Cashier@123, Chef@123)
-- Standard BCrypt hashes; also validated by DataInitializer on startup
INSERT INTO users (id, username, password_hash, full_name, role, email, phone, is_active)
VALUES 
(1, 'admin', '$2a$10$wT2iZ0U06LgD7H9z17w8ee6G5W0sIeq87V79Xz1bXUjYVp9wB8pne', 'System Administrator', 'ADMIN', 'admin@royalfeast.com', '+91 98765 00001', TRUE),
(2, 'cashier', '$2a$10$wT2iZ0U06LgD7H9z17w8ee6G5W0sIeq87V79Xz1bXUjYVp9wB8pne', 'Front Cashier Officer', 'CASHIER', 'cashier@royalfeast.com', '+91 98765 00002', TRUE),
(3, 'chef', '$2a$10$wT2iZ0U06LgD7H9z17w8ee6G5W0sIeq87V79Xz1bXUjYVp9wB8pne', 'Head Kitchen Chef', 'KITCHEN_STAFF', 'kitchen@royalfeast.com', '+91 98765 00003', TRUE)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Menu Categories
INSERT INTO menu_categories (id, name, description, display_order)
VALUES
(1, 'Starters & Appetizers', 'Crispy sizzling appetizers and starters', 1),
(2, 'Main Course', 'Rich curries, gourmet mains and specialties', 2),
(3, 'Breads & Rice', 'Tandoori breads, fragrant basmati biryanis and pulaos', 3),
(4, 'Beverages & Mocktails', 'Refreshing coolers, shakes, and signature mocktails', 4),
(5, 'Desserts', 'Decadent sweet endings and ice cream sundaes', 5)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, is_veg, image_url, is_available, is_archived)
VALUES
(1, 1, 'Paneer Tikka Sizzler', 'Cottage cheese cubes marinated in spiced hung curd with bell peppers and roasted in tandoor', 280.00, TRUE, '/images/paneer_tikka.png', TRUE, FALSE),
(2, 1, 'Crispy Corn Pepper Fry', 'Golden American corn tossed with cracked black pepper, curry leaves, and scallions', 190.00, TRUE, '/images/crispy_corn.png', TRUE, FALSE),
(3, 1, 'Chicken Tikka Angaara', 'Succulent boneless chicken chunks smoked over glowing charcoal with aromatic spices', 320.00, FALSE, '/images/chicken_tikka.png', TRUE, FALSE),
(4, 2, 'Royal Butter Chicken', 'Tender chicken simmered in a silky tomato, cashew cream, and rich butter gravy', 380.00, FALSE, '/images/butter_chicken.png', TRUE, FALSE),
(5, 2, 'Dal Makhani Bukhara', 'Slow-cooked black lentils simmered overnight with tomatoes, churned butter and fresh cream', 260.00, TRUE, '/images/dal_makhani.png', TRUE, FALSE),
(6, 2, 'Paneer Butter Masala', 'Melt-in-mouth cottage cheese in mildly sweet, velvety tomato-onion gravy with fenugreek', 310.00, TRUE, '/images/paneer_butter_masala.png', TRUE, FALSE),
(7, 2, 'Margherita Artisan Pizza', 'Handcrafted sourdough base topped with San Marzano sauce, fresh mozzarella & basil', 340.00, TRUE, '/images/margherita_pizza.png', TRUE, FALSE),
(8, 2, 'Royal Gourmet Burger', 'Double patty gourmet burger with aged cheddar, caramelized onions, crisp lettuce & fries', 290.00, FALSE, '/images/royal_burger.png', TRUE, FALSE),
(9, 3, 'Hyderabadi Dum Biryani', 'Aromatic long-grain basmati rice layered with spiced marinated meat, saffron and ghee', 350.00, FALSE, '/images/dum_biryani.png', TRUE, FALSE),
(10, 3, 'Garlic Butter Naan', 'Clay oven leavened bread brushed with minced garlic butter and fresh coriander', 60.00, TRUE, '/images/garlic_naan.png', TRUE, FALSE),
(11, 4, 'Strawberry Mint Mojito', 'Crushed fresh strawberries, mint sprigs, lime wedges, and sparkling soda', 160.00, TRUE, '/images/strawberry_mojito.png', TRUE, FALSE),
(12, 5, 'Gulab Jamun with Rabri', 'Warm khoya dumplings soaked in rose saffron syrup served with chilled thickened rabri', 150.00, TRUE, '/images/gulab_jamun.png', TRUE, FALSE)
ON DUPLICATE KEY UPDATE price = VALUES(price);

-- Restaurant Tables
INSERT INTO restaurant_tables (id, table_number, seating_capacity, section, status)
VALUES
(1, 'T-01', 2, 'Window Section', 'AVAILABLE'),
(2, 'T-02', 4, 'Window Section', 'AVAILABLE'),
(3, 'T-03', 4, 'Main Dining Hall', 'AVAILABLE'),
(4, 'T-04', 6, 'Family Booth', 'AVAILABLE'),
(5, 'T-05', 8, 'Banquet & Party', 'AVAILABLE'),
(6, 'T-06', 4, 'Open Terrace Garden', 'AVAILABLE'),
(7, 'T-07', 2, 'Rooftop Lounge', 'AVAILABLE'),
(8, 'T-08', 4, 'Rooftop Lounge', 'AVAILABLE')
ON DUPLICATE KEY UPDATE seating_capacity = VALUES(seating_capacity);

-- Sample Customers
INSERT INTO customers (id, name, phone, email, total_visits, total_spent)
VALUES
(1, 'Rahul Sharma', '+91 98765 11111', 'rahul.sharma@example.com', 5, 2450.00),
(2, 'Priya Patel', '+91 98765 22222', 'priya.patel@example.com', 3, 1680.00),
(3, 'Amit Verma', '+91 98765 33333', 'amit.verma@example.com', 8, 4920.00)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Ingredients
INSERT INTO ingredients (id, name, unit, current_stock, min_threshold, unit_cost, supplier)
VALUES
(1, 'Fresh Paneer', 'kg', 24.50, 5.00, 320.00, 'Green Valley Organic Farms'),
(2, 'Chicken Boneless', 'kg', 32.00, 10.00, 240.00, 'Fresh Farms Poultry Ltd'),
(3, 'Churned Butter', 'kg', 18.00, 4.00, 450.00, 'Amul Dairy Supplies'),
(4, 'Basmati Long Rice', 'kg', 55.00, 12.00, 110.00, 'Kohinoor Grain Merchants'),
(5, 'Fresh Heavy Cream', 'l', 14.00, 3.00, 220.00, 'Dairy Fresh Co'),
(6, 'Refined Flour (Maida)', 'kg', 45.00, 8.00, 45.00, 'Aashirvaad Mills'),
(7, 'Tomato Gravy Puree', 'kg', 25.00, 6.00, 90.00, 'ChefChoice Supplies'),
(8, 'Whole Spices Garam Masala', 'kg', 8.50, 2.00, 650.00, 'Kerala Spices Board')
ON DUPLICATE KEY UPDATE current_stock = VALUES(current_stock);

-- Recipes linking Menu Items to Ingredients
INSERT INTO menu_item_recipes (menu_item_id, ingredient_id, quantity_required)
VALUES
(1, 1, 0.200), -- Paneer Tikka -> 200g Paneer
(1, 8, 0.020), -- Paneer Tikka -> 20g Spices
(4, 2, 0.250), -- Butter Chicken -> 250g Chicken
(4, 3, 0.050), -- Butter Chicken -> 50g Butter
(4, 5, 0.050), -- Butter Chicken -> 50ml Cream
(4, 7, 0.150), -- Butter Chicken -> 150g Tomato Gravy
(6, 1, 0.200), -- Paneer Butter Masala -> 200g Paneer
(6, 3, 0.040), -- Paneer Butter Masala -> 40g Butter
(6, 5, 0.040), -- Paneer Butter Masala -> 40ml Cream
(6, 7, 0.150), -- Paneer Butter Masala -> 150g Tomato Gravy
(9, 2, 0.200), -- Dum Biryani -> 200g Chicken
(9, 4, 0.150), -- Dum Biryani -> 150g Basmati Rice
(9, 8, 0.025), -- Dum Biryani -> 25g Spices
(10, 6, 0.120), -- Garlic Naan -> 120g Flour
(10, 3, 0.020)  -- Garlic Naan -> 20g Butter
ON DUPLICATE KEY UPDATE quantity_required = VALUES(quantity_required);

-- Settings
INSERT INTO restaurant_settings (setting_key, setting_value, description)
VALUES
('restaurant_name', 'Royal Feast Dine & Lounge', 'Official display name of the restaurant'),
('restaurant_tagline', 'Exquisite Flavors, Unforgettable Dining', 'Tagline printed on receipts and branding'),
('restaurant_address', '42 Gourmet Boulevard, Indiranagar, Bengaluru, KA 560038', 'Complete physical address'),
('restaurant_phone', '+91 98765 43210', 'Primary contact phone number'),
('restaurant_email', 'contact@royalfeast.com', 'Official billing and contact email'),
('restaurant_gst', '29AABCU9603R1ZM', 'GSTIN or Business Tax Identification Number'),
('currency_symbol', '₹', 'Currency symbol used across UI and PDF receipts'),
('cgst_rate', '2.50', 'Central Goods and Services Tax rate percentage'),
('sgst_rate', '2.50', 'State Goods and Services Tax rate percentage'),
('service_charge_rate', '0.00', 'Optional restaurant service charge percentage')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
