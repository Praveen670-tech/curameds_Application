-- ==============================================================
-- CURAMEDS MEDICINE MONITORING & TELEMEDICINE PLATFORM
-- File: 02_demo_data.sql
-- Purpose: Sample development & demonstration records
-- Note: Passwords are encrypted with BCrypt (Cost 10)
-- Credentials reference:
--   admin       -> Admin@123
--   patient     -> Patient@123
--   donor       -> Donor@123
--   medicalshop -> Shop@123
--   ngo_care    -> Ngo@123
--   caregiver   -> Care@123
-- ==============================================================

USE curameds_db;

-- 1. Demo User Accounts
INSERT IGNORE INTO users (id, name, username, password, email, role, phone, age) VALUES
(1, 'Admin Supervisor', 'admin', '$2a$10$wO08f9B1O41bQ1Lg3.m7VOPaU5jO71Z/kL7rYfS.k5k9kFqgq/51C', 'admin@curameds.org', 'ADMIN', '+91 9876543210', 35),
(2, 'Praveen N', 'patient', '$2a$10$7c0P7z49Q7V6w7X1zE0C3OuR3qN1kF1A2rL9bV7kF8k9kFqgq/51C', 'praveen@gmail.com', 'PATIENT', '+91 9123456789', 28),
(3, 'Dr. Ramesh Kumar', 'donor', '$2a$10$d8B9f1L0K2V4m6X8zP0A4OuE4qN2kF2B3rM0bW8kG9k0kFqgq/51C', 'ramesh.donor@curameds.org', 'DONOR', '+91 9988776655', 42),
(4, 'Apollo City Meds', 'medicalshop', '$2a$10$f9C0g2M1L3W5n7Y9zQ1B5OuF5qO3kG3C4rN1bX9kH0k1kFqgq/51C', 'apollo.shop@curameds.org', 'MEDICAL_SHOP', '+91 9871122334', 45),
(5, 'Aarogya Seva Trust', 'ngo_care', '$2a$10$g0D1h3N2M4X6o8Z0zR2C6OuG6qP4kH4D5rO2bY0kI1k2kFqgq/51C', 'ngo@aarogya.org', 'NGO', '+91 9765432109', 50),
(6, 'Suman Caregiver', 'caregiver', '$2a$10$h1E2i4O3N5Y7p9A1zS3D7OuH7qQ5kI5E6rP3bZ1kJ2k3kFqgq/51C', 'suman.care@curameds.org', 'FAMILY_MEMBER', '+91 9845012345', 34);

-- 2. User Profiles
INSERT IGNORE INTO user_profiles (user_id, organization_name, license_number, address_line, city, state, postal_code, is_verified) VALUES
(1, 'CuraMeds Regulatory Authority', 'REG-IN-2026-001', 'Block B, Health Ministry Complex', 'New Delhi', 'Delhi', '110001', TRUE),
(2, 'Personal Health Vault', NULL, '42 Palm Avenue, Indiranagar', 'Bengaluru', 'Karnataka', '560038', TRUE),
(3, 'Apollo Life Healthcare Clinic', 'MED-KA-9921', '8th Main, Koramangala', 'Bengaluru', 'Karnataka', '560034', TRUE),
(4, 'Apollo City Meds Pvt Ltd', 'DL-KA-2024-4412', '124 Commercial Street', 'Bengaluru', 'Karnataka', '560001', TRUE),
(5, 'Aarogya Seva Community Trust', 'NGO-NITI-88219', '15 Gandhi Road', 'Mysuru', 'Karnataka', '570001', TRUE),
(6, 'Caregiver Auxiliary', NULL, '77 Lakeview Layout', 'Bengaluru', 'Karnataka', '560068', TRUE);

-- 3. Verified Medicine Listings
INSERT IGNORE INTO medicine_listings (id, name, manufacturer, batch_number, category, dosage_form, price, expiry_date, quantity, status, verification_status, owner_id, rx_required, storage_condition) VALUES
(1, 'Paracetamol 500mg', 'Cipla Ltd', 'BCH-2024-01', 'Analgesic & Antipyretic', 'Tablet', 25.0, DATE_ADD(CURRENT_DATE, INTERVAL 14 MONTH), 120, 'AVAILABLE', 'VERIFIED', 3, FALSE, 'Room temperature 15-25°C'),
(2, 'Amoxicillin 250mg', 'Sun Pharma', 'BCH-2024-02', 'Antibiotic', 'Capsule', 65.0, DATE_ADD(CURRENT_DATE, INTERVAL 10 MONTH), 50, 'AVAILABLE', 'VERIFIED', 3, TRUE, 'Dry place, protect from moisture'),
(3, 'Metformin 500mg', 'Lupin Life', 'BCH-2024-03', 'Antidiabetic', 'Tablet', 40.0, DATE_ADD(CURRENT_DATE, INTERVAL 18 MONTH), 90, 'AVAILABLE', 'VERIFIED', 3, TRUE, 'Store below 30°C'),
(4, 'Cetirizine 10mg', 'Dr. Reddy''s', 'BCH-2024-04', 'Antihistamine', 'Tablet', 18.0, DATE_ADD(CURRENT_DATE, INTERVAL 8 MONTH), 60, 'AVAILABLE', 'VERIFIED', 3, FALSE, 'Room temperature'),
(5, 'Azithromycin 500mg', 'Zydus Cadila', 'BCH-2024-05', 'Antibiotic', 'Tablet', 110.0, DATE_ADD(CURRENT_DATE, INTERVAL 6 MONTH), 35, 'AVAILABLE', 'VERIFIED', 3, TRUE, 'Store below 25°C');

-- 4. Medicine Batches Tracking
INSERT IGNORE INTO medicine_batches (id, listing_id, batch_number, manufacturing_date, expiry_date, initial_quantity, remaining_quantity, qc_passed) VALUES
(1, 1, 'BCH-2024-01', DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH), DATE_ADD(CURRENT_DATE, INTERVAL 14 MONTH), 120, 120, TRUE),
(2, 2, 'BCH-2024-02', DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), DATE_ADD(CURRENT_DATE, INTERVAL 10 MONTH), 50, 50, TRUE),
(3, 3, 'BCH-2024-03', DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH), DATE_ADD(CURRENT_DATE, INTERVAL 18 MONTH), 90, 90, TRUE),
(4, 4, 'BCH-2024-04', DATE_SUB(CURRENT_DATE, INTERVAL 4 MONTH), DATE_ADD(CURRENT_DATE, INTERVAL 8 MONTH), 60, 60, TRUE),
(5, 5, 'BCH-2024-05', DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH), DATE_ADD(CURRENT_DATE, INTERVAL 6 MONTH), 35, 35, TRUE);

-- 5. Pharmacy Inventory Records (Apollo City Meds)
INSERT IGNORE INTO inventory_records (id, medicine_name, batch_number, category, quantity, min_threshold, unit_price, expiry_date, supplier, shop_username) VALUES
(1, 'Paracetamol 500mg', 'BCH-991', 'Analgesic & Antipyretic', 450, 50, 22.50, DATE_ADD(CURRENT_DATE, INTERVAL 16 MONTH), 'Cipla Direct Distribution', 'medicalshop'),
(2, 'Atorvastatin 10mg', 'BCH-992', 'Cardiovascular', 80, 20, 145.00, DATE_ADD(CURRENT_DATE, INTERVAL 12 MONTH), 'Sun Life Distributors', 'medicalshop'),
(3, 'Pantoprazole 40mg', 'BCH-993', 'Gastrointestinal', 15, 25, 95.00, DATE_ADD(CURRENT_DATE, INTERVAL 9 MONTH), 'Alkem Healthcare Hub', 'medicalshop');

-- 6. Initial Inventory Movements
INSERT IGNORE INTO inventory_movements (id, inventory_id, movement_type, quantity_changed, balance_after, reason, performed_by) VALUES
(1, 1, 'RESTOCK', 450, 450, 'Initial wholesale dispensary stocking', 'medicalshop'),
(2, 2, 'RESTOCK', 80, 80, 'Monthly replenishment batch received', 'medicalshop'),
(3, 3, 'RESTOCK', 15, 15, 'Emergency low-stock transfer', 'medicalshop');

-- 7. Subsidized Discount Offers
INSERT IGNORE INTO discount_offers (id, title, medicine_name, discount_percent, original_price, discounted_price, valid_until, coupon_code, description, shop_username, status) VALUES
(1, 'Senior Citizen Essential Care', 'Metformin 500mg', 30, 50.00, 35.00, DATE_ADD(CURRENT_DATE, INTERVAL 3 MONTH), 'CURA30', '30% subsidy on chronic maintenance diabetes medication for elderly individuals', 'medicalshop', 'ACTIVE'),
(2, 'Seasonal Allergy Relief Initiative', 'Cetirizine 10mg', 25, 24.00, 18.00, DATE_ADD(CURRENT_DATE, INTERVAL 2 MONTH), 'RELIEF25', 'Special subsidized healthcare coupon for seasonal flu and allergy relief', 'medicalshop', 'ACTIVE');

-- 8. Family Care Dependents
INSERT IGNORE INTO family_members (id, relative_name, relationship, age, contact_phone, medical_conditions, current_medications, guardian_username) VALUES
(1, 'Radha Narayanan', 'Mother', 62, '+91 9845012349', 'Type-2 Diabetes, Mild Hypertension', 'Metformin 500mg (Morning), Amlodipine 5mg (Evening)', 'patient');

-- 9. Transaction Records & Activity Ledger
INSERT IGNORE INTO transaction_records (id, type, title, description, performed_by, related_entity, status) VALUES
(1, 'LISTING', 'Paracetamol 500mg batch registered', '120 units listed by Dr. Ramesh Kumar with verified seal', 'donor', 'Paracetamol 500mg', 'VERIFIED'),
(2, 'VERIFICATION', 'Quality Check Approved', 'Batch BCH-2024-01 inspected and approved for community distribution', 'admin', 'Cipla Ltd', 'COMPLETED'),
(3, 'RESTOCK', 'Dispensary Buffer Stocked', '450 units of Paracetamol added to inventory vault', 'medicalshop', 'Apollo City Meds', 'COMPLETED');
