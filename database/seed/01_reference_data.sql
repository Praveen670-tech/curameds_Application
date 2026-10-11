-- ==============================================================
-- CURAMEDS MEDICINE MONITORING & TELEMEDICINE PLATFORM
-- File: 01_reference_data.sql
-- Purpose: System lookup tables, legal roles, and therapeutic classifications
-- ==============================================================

USE curameds_db;

-- 1. Seed Roles Master Table
INSERT INTO roles (name, description) VALUES
('PATIENT', 'Individual patient seeking medicines, proposing swaps, and managing family dependents'),
('DONOR', 'Accredited individual or healthcare donor supplying unexpired surplus medicines'),
('MEDICAL_SHOP', 'Licensed pharmacy or dispensary monitoring commercial inventory and subsidies'),
('NGO', 'Non-Governmental Healthcare Organization claiming donations for free community clinics'),
('FAMILY_MEMBER', 'Authorized family caregiver managing chronic prescriptions for dependents'),
('ADMIN', 'Platform regulatory supervisor verifying medicine batches and managing accounts')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- 2. Seed Medicine Therapeutic Categories
INSERT INTO medicine_categories (name, therapeutic_class, is_prescription_required, description) VALUES
('Analgesic & Antipyretic', 'Pain Relief & Fever', FALSE, 'Non-opioid pain relievers and fever reducing medications such as Paracetamol and Ibuprofen.'),
('Antibiotic', 'Antimicrobial / Antibacterial', TRUE, 'Regulated prescription antibiotics such as Amoxicillin, Azithromycin, and Ciprofloxacin.'),
('Antidiabetic', 'Endocrine & Metabolic Care', TRUE, 'Oral hypoglycemics and insulin regulators such as Metformin and Glimepiride.'),
('Antihistamine', 'Allergy & Immunology', FALSE, 'Over-the-counter and prescription allergy relief formulations including Cetirizine and Levocetirizine.'),
('Cardiovascular', 'Cardiology & Hypertension', TRUE, 'Heart rate and blood pressure regulation agents including Atorvastatin and Amlodipine.'),
('Gastrointestinal', 'Gastroenterology', FALSE, 'Antacids, proton-pump inhibitors, and gut motility agents including Pantoprazole and Omeprazole.'),
('Respiratory', 'Pulmonology', TRUE, 'Inhalers, bronchodilators, and cough suppression medications including Salbutamol and Budesonide.'),
('Vitamins & Supplements', 'Nutritional Support', FALSE, 'Essential micronutrients, calcium, Vitamin D3, and multivitamin complexes.')
ON DUPLICATE KEY UPDATE description = VALUES(description);
