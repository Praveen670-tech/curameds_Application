-- ==============================================================
-- CURAMEDS HEALTHCARE & MEDICINE MONITORING PLATFORM
-- Normalized MySQL Schema
-- ==============================================================

CREATE DATABASE IF NOT EXISTS curameds_db;
USE curameds_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Medicine Listings Table
CREATE TABLE IF NOT EXISTS medicine_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    batch_number VARCHAR(100),
    category VARCHAR(100) DEFAULT 'General',
    dosage_form VARCHAR(50) DEFAULT 'Tablet',
    price DOUBLE DEFAULT 0.0,
    expiry_date DATE NOT NULL,
    quantity INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    owner_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Donation Requests Table
CREATE TABLE IF NOT EXISTS donation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT,
    donor_id BIGINT,
    ngo_id BIGINT,
    medicine_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    pickup_address VARCHAR(500),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES medicine_listings(id) ON DELETE SET NULL,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Exchange Requests Table
CREATE TABLE IF NOT EXISTS exchange_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT,
    requester_id BIGINT,
    medicine_name VARCHAR(255) NOT NULL,
    offered_medicine VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES medicine_listings(id) ON DELETE SET NULL,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Inventory Records Table (Medical Shops)
CREATE TABLE IF NOT EXISTS inventory_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100),
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    min_threshold INT DEFAULT 10,
    unit_price DOUBLE DEFAULT 0.0,
    expiry_date DATE,
    supplier VARCHAR(255),
    shop_username VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Safe Disposal Requests Table
CREATE TABLE IF NOT EXISTS safe_disposal_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100),
    quantity INT NOT NULL,
    reason VARCHAR(255),
    hazard_level VARCHAR(50) DEFAULT 'STANDARD',
    facility_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    requester_username VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Family Members Table (Caregivers & Dependents)
CREATE TABLE IF NOT EXISTS family_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    relative_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    age INT,
    contact_phone VARCHAR(50),
    medical_conditions TEXT,
    current_medications TEXT,
    guardian_username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Discount Offers Table
CREATE TABLE IF NOT EXISTS discount_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    discount_percent INT NOT NULL,
    original_price DOUBLE,
    discounted_price DOUBLE,
    valid_until DATE,
    coupon_code VARCHAR(50),
    description TEXT,
    shop_username VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Transaction Records & Audit Trail Table
CREATE TABLE IF NOT EXISTS transaction_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    performed_by VARCHAR(100),
    related_entity VARCHAR(100),
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
