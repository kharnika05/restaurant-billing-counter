-- V3__add_biryanis_and_diverse_menu_items.sql

-- Add Biryani Specials Category
INSERT INTO menu_categories (id, name, description, display_order)
VALUES (6, 'Biryani Specials', 'Authentic Handi Dum Biryanis, Slow-Cooked with Saffron & Royal Spices', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), display_order = VALUES(display_order);

UPDATE menu_categories SET display_order = 2 WHERE id = 1;
UPDATE menu_categories SET display_order = 3 WHERE id = 2;
UPDATE menu_categories SET display_order = 4 WHERE id = 3;
UPDATE menu_categories SET display_order = 5 WHERE id = 4;
UPDATE menu_categories SET display_order = 6 WHERE id = 5;

-- Insert Biryanis & Diverse Food Items
INSERT INTO menu_items (id, category_id, name, description, price, is_veg, image_url, is_available, is_archived)
VALUES
-- Biryani Specials
(9, 6, 'Hyderabadi Chicken Dum Biryani', 'Aromatic long-grain basmati rice layered with spiced marinated chicken, saffron, mint and desi ghee', 350.00, FALSE, '/images/dum_biryani.png', TRUE, FALSE),
(13, 6, 'Royal Mutton Dum Biryani', 'Slow-cooked succulent tender lamb cuts dum-cooked in sealed clay handi with aged basmati and brown fried onions', 440.00, FALSE, '/images/mutton_biryani.png', TRUE, FALSE),
(14, 6, 'Shahi Paneer Dum Biryani', 'Golden marinated paneer cubes, garden peas, and fragrant saffron basmati rice layered with rose water and cashews', 290.00, TRUE, '/images/paneer_biryani.png', TRUE, FALSE),
(15, 6, 'Awadhi Lucknowi Chicken Biryani', 'Delicate and mild Awadhi royal chicken biryani infused with green cardamom, kewra, saffron, and rich stock', 370.00, FALSE, '/images/awadhi_biryani.png', TRUE, FALSE),
(16, 6, 'Spicy Egg Dum Biryani', 'Crisp spiced farm eggs simmered in roasted onion-tomato masala and layered with fragrant basmati rice', 250.00, FALSE, '/images/egg_biryani.png', TRUE, FALSE),
(17, 6, 'Coastal Prawns Dum Biryani', 'Juicy marinated tiger prawns cooked in coastal aromatic spice blend, layered with fluffy basmati and fried shallots', 420.00, FALSE, '/images/prawns_biryani.png', TRUE, FALSE),

-- Diverse Starters
(18, 1, 'Spicy Chicken 65', 'Crispy fried chicken bites tossed with fiery South Indian curry leaves, crushed garlic, and green chilies', 290.00, FALSE, '/images/chicken_65.png', TRUE, FALSE),
(19, 1, 'Tandoori Malai Chaap', 'Soya chaap marinated in rich cashew cream paste, hung curd, cardamom, and charred in clay tandoor', 260.00, TRUE, '/images/malai_chaap.png', TRUE, FALSE),
(20, 1, 'Hara Bhara Kabab', 'Crispy spinach, green pea, and potato patties stuffed with spiced nuts and melted cottage cheese', 230.00, TRUE, '/images/hara_bhara_kabab.png', TRUE, FALSE),

-- Diverse Main Course
(21, 2, 'Kashmiri Mutton Rogan Josh', 'Tender lamb shanks slow-braised in Kashmiri chilies, aromatic whole spices, and rich velvety gravy', 450.00, FALSE, '/images/rogan_josh.png', TRUE, FALSE),
(22, 2, 'Kadhai Paneer Special', 'Fresh cottage cheese cubes tossed with crunchy bell peppers, onions, and freshly pounded kadhai spices', 310.00, TRUE, '/images/kadhai_paneer.png', TRUE, FALSE),
(23, 2, 'Chicken Tikka Masala', 'Charcoal-grilled boneless chicken chunks simmered in a mildly spiced buttery tomato cream gravy', 370.00, FALSE, '/images/chicken_tikka_masala.png', TRUE, FALSE),

-- Diverse Beverages & Desserts
(24, 4, 'Royal Mango Lassi', 'Chilled thick yogurt smoothie blended with ripe Alphonso mango puree and garnished with saffron and pistachios', 140.00, TRUE, '/images/mango_lassi.png', TRUE, FALSE),
(25, 4, 'Blue Curacao Lagoon Cooler', 'Vibrant citrus cooler with blue curacao syrup, crushed ice, fresh mint, and sparkling effervescence', 160.00, TRUE, '/images/blue_lagoon.png', TRUE, FALSE),
(26, 5, 'Sizzling Brownie with Gelato', 'Warm dark chocolate fudge brownie served on a smoking hot sizzler plate with vanilla gelato & chocolate drizzle', 220.00, TRUE, '/images/sizzling_brownie.png', TRUE, FALSE),
(27, 5, 'Kesar Pista Rasmalai', 'Soft, delicate cottage cheese dumplings soaked in chilled saffron cardamom milk and topped with slivered pistachios', 170.00, TRUE, '/images/rasmalai.png', TRUE, FALSE)
ON DUPLICATE KEY UPDATE 
    category_id = VALUES(category_id),
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    is_veg = VALUES(is_veg),
    image_url = VALUES(image_url),
    is_available = VALUES(is_available);
