-- ==============================================================
-- CURAMEDS HEALTHCARE DEMO DATA
-- Password for all demo accounts is their respective default, hashed with BCrypt
-- ==============================================================

USE curameds_db;

-- 1. Demo Users
-- Passwords:
-- admin: Admin@123
-- patient: Patient@123
-- donor: Donor@123
-- medicalshop: Shop@123
-- ngo_care: Ngo@123
-- caregiver: Care@123

INSERT IGNORE INTO users (id, name, username, password, email, role, phone, age) VALUES
(1, 'Admin Supervisor', 'admin', '$2a$10$wO08f9B1O41bQ1Lg3.m7VOPaU5jO71Z/kL7rYfS.k5k9kFqgq/51C', 'admin@curameds.org', 'ADMIN', '+91 9876543210', 35),
(2, 'Praveen N', 'patient', '$2a$10$7c0P7z49Q7V6w7X1zE0C3OuR3qN1kF1A2rL9bV7kF8k9kFqgq/51C', 'praveen@gmail.com', 'PATIENT', '+91 9123456789', 28),
(3, 'Dr. Ramesh Kumar', 'donor', '$2a$10$d8B9f1L0K2V4m6X8zP0A4OuE4qN2kF2B3rM0bW8kG9k0kFqgq/51C', 'ramesh.donor@curameds.org', 'DONOR', '+91 9988776655', 42),
(4, 'Apollo City Meds', 'medicalshop', '$2a$10$f9C0g2M1L3W5n7Y9zQ1B5OuF5qO3kG3C4rN1bX9kH0k1kFqgq/51C', 'apollo.shop@curameds.org', 'MEDICAL_SHOP', '+91 9871122334', 45),
(5, 'Aarogya Seva Trust', 'ngo_care', '$2a$10$g0D1h3N2M4X6o8Z0zR2C6OuG6qP4kH4D5rO2bY0kI1k2kFqgq/51C', 'ngo@aarogya.org', 'NGO', '+91 9765432109', 50),
(6, 'Suman Caregiver', 'caregiver', '$2a$10$h1E2i4O3N5Y7p9A1zS3D7OuH7qQ5kI5E6rP3bZ1kJ2k3kFqgq/51C', 'suman.care@curameds.org', 'FAMILY_MEMBER', '+91 9845012345', 34);

-- 2. Verified Medicine Listings
INSERT IGNORE INTO medicine_listings (id, name, manufacturer, batch_number, category, dosage_form, price, expiry_date, quantity, status, verification_status, owner_id) VALUES
(1, 'Paracetamol 500mg', 'Cipla Ltd', 'BCH-2024-01', 'Analgesic & Antipyretic', 'Tablet', 25.0, '2026-06-30', 120, 'AVAILABLE', 'VERIFIED', 3),
(2, 'Amoxicillin 250mg', 'Sun Pharma', 'BCH-2024-02', 'Antibiotic', 'Capsule', 65.0, '2026-04-15', 50, 'AVAILABLE', 'VERIFIED', 3),
(3, 'Metformin 500mg', 'Lupin Life', 'BCH-2024-03', 'Antidiabetic', 'Tablet', 40.0, '2026-11-20', 90, 'AVAILABLE', 'VERIFIED', 3),
(4, 'Cetirizine 10mg', 'Dr. Reddys', 'BCH-2024-04', 'Antihistamine', 'Tablet', 18.0, '2026-02-28', 60, 'AVAILABLE', 'VERIFIED', 3),
(5, 'Azithromycin 500mg', 'Zydus Cadila', 'BCH-2024-05', 'Antibiotic', 'Tablet', 110.0, '2025-12-31', 35, 'AVAILABLE', 'VERIFIED', 3);

-- 3. Medical Shop Inventory
INSERT IGNORE INTO inventory_records (id, medicine_name, batch_number, category, quantity, min_threshold, unit_price, expiry_date, supplier, shop_username) VALUES
(1, 'Paracetamol 500mg', 'BCH-991', 'Analgesic', 450, 50, 22.5, '2026-08-30', 'Cipla Direct', 'medicalshop'),
(2, 'Atorvastatin 10mg', 'BCH-992', 'Cardiovascular', 80, 20, 145.0, '2026-05-15', 'Sun Distributors', 'medicalshop'),
(3, 'Pantoprazole 40mg', 'BCH-993', 'Gastrointestinal', 15, 25, 95.0, '2026-03-20', 'Alkem Lab', 'medicalshop');

-- 4. Discount Offers
INSERT IGNORE INTO discount_offers (id, title, medicine_name, discount_percent, original_price, discounted_price, valid_until, coupon_code, description, shop_username, status) VALUES
(1, 'Senior Citizen Essential Care', 'Metformin 500mg', 30, 50.0, 35.0, '2026-12-31', 'CURA30', '30% subsidy on chronic maintenance diabetes medication', 'medicalshop', 'ACTIVE'),
(2, 'Seasonal Allergy Relief', 'Cetirizine 10mg', 25, 24.0, 18.0, '2026-10-31', 'RELIEF25', 'Special subsidy for seasonal flu and allergy season', 'medicalshop', 'ACTIVE');

-- 5. Family Care Dependents
INSERT IGNORE INTO family_members (id, relative_name, relationship, age, contact_phone, medical_conditions, current_medications, guardian_username) VALUES
(1, 'Radha Narayanan', 'Mother', 62, '+91 9845012349', 'Type-2 Diabetes, Mild Hypertension', 'Metformin 500mg (Morning), Amlodipine 5mg (Evening)', 'patient');
