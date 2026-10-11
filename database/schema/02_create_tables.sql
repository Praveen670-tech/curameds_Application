-- ==============================================================
-- CURAMEDS MEDICINE MONITORING & TELEMEDICINE PLATFORM
-- File: 02_create_tables.sql
-- Purpose: Normalized relational schema definition in dependency order
-- ==============================================================

USE curameds_db;

-- 1. Roles Master Table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'PATIENT',
    phone VARCHAR(50),
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_age CHECK (age IS NULL OR (age >= 0 AND age <= 130))
) ENGINE=InnoDB;

-- 3. User Profiles Table (Extended Profile & Accreditation)
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    organization_name VARCHAR(255),
    license_number VARCHAR(100),
    address_line VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Medicine Categories Table
CREATE TABLE IF NOT EXISTS medicine_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    therapeutic_class VARCHAR(150),
    is_prescription_required BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Medicine Listings Table (Core Traceable Inventory for Donors & Patients)
CREATE TABLE IF NOT EXISTS medicine_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    dosage_form VARCHAR(50) DEFAULT 'Tablet',
    price DOUBLE NOT NULL DEFAULT 0.0,
    expiry_date DATE NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    owner_id BIGINT,
    rx_required BOOLEAN DEFAULT FALSE,
    storage_condition VARCHAR(150) DEFAULT 'Store below 25°C in a dry place',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_listing_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_listing_price CHECK (price >= 0.0),
    CONSTRAINT fk_listing_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Medicine Batches Table (Lot-level traceability)
CREATE TABLE IF NOT EXISTS medicine_batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT,
    batch_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE,
    expiry_date DATE NOT NULL,
    initial_quantity INT NOT NULL,
    remaining_quantity INT NOT NULL,
    qc_passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_batch_qty CHECK (remaining_quantity >= 0),
    CONSTRAINT fk_batch_listing FOREIGN KEY (listing_id) REFERENCES medicine_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Medicine Verifications Table (Admin / Pharmacist Regulatory Audit)
CREATE TABLE IF NOT EXISTS medicine_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    verifier_id BIGINT,
    decision VARCHAR(50) NOT NULL,
    remarks TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_verify_listing FOREIGN KEY (listing_id) REFERENCES medicine_listings(id) ON DELETE CASCADE,
    CONSTRAINT fk_verify_user FOREIGN KEY (verifier_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Donation Requests Table
CREATE TABLE IF NOT EXISTS donation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT,
    donor_id BIGINT,
    ngo_id BIGINT,
    medicine_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    pickup_address VARCHAR(500),
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_donation_qty CHECK (quantity > 0),
    CONSTRAINT fk_donation_listing FOREIGN KEY (listing_id) REFERENCES medicine_listings(id) ON DELETE SET NULL,
    CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_donation_ngo FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Exchange Requests Table
CREATE TABLE IF NOT EXISTS exchange_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT,
    requester_id BIGINT,
    medicine_name VARCHAR(255) NOT NULL,
    offered_medicine VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_exchange_qty CHECK (quantity > 0),
    CONSTRAINT fk_exchange_listing FOREIGN KEY (listing_id) REFERENCES medicine_listings(id) ON DELETE SET NULL,
    CONSTRAINT fk_exchange_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. Medical Shop Inventory Records Table
CREATE TABLE IF NOT EXISTS inventory_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    min_threshold INT NOT NULL DEFAULT 10,
    unit_price DOUBLE NOT NULL DEFAULT 0.0,
    expiry_date DATE NOT NULL,
    supplier VARCHAR(255),
    shop_username VARCHAR(100) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_inv_qty CHECK (quantity >= 0),
    CONSTRAINT chk_inv_threshold CHECK (min_threshold >= 0),
    CONSTRAINT chk_inv_price CHECK (unit_price >= 0.0)
) ENGINE=InnoDB;

-- 11. Inventory Movements Table (Traceable Stock Adjustments)
CREATE TABLE IF NOT EXISTS inventory_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inventory_id BIGINT NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'RESTOCK', 'DISPENSED', 'EXPIRED_REMOVAL', 'ADJUSTMENT'
    quantity_changed INT NOT NULL,
    balance_after INT NOT NULL,
    reason VARCHAR(255),
    performed_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movement_inv FOREIGN KEY (inventory_id) REFERENCES inventory_records(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Safe Disposal Requests Table (Eco-Certified Pharmaceutical Incineration)
CREATE TABLE IF NOT EXISTS safe_disposal_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100),
    quantity INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    hazard_level VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    facility_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    requester_username VARCHAR(100) NOT NULL,
    scheduled_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_disposal_qty CHECK (quantity > 0)
) ENGINE=InnoDB;

-- 13. Family Members Table (Caregivers & Dependents)
CREATE TABLE IF NOT EXISTS family_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    relative_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    age INT,
    contact_phone VARCHAR(50),
    medical_conditions TEXT,
    current_medications TEXT,
    guardian_username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_family_age CHECK (age IS NULL OR (age >= 0 AND age <= 130))
) ENGINE=InnoDB;

-- 14. Discount Offers Table (Pharmacy Subsidies & Coupons)
CREATE TABLE IF NOT EXISTS discount_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    discount_percent INT NOT NULL,
    original_price DOUBLE NOT NULL,
    discounted_price DOUBLE NOT NULL,
    valid_until DATE NOT NULL,
    coupon_code VARCHAR(50) NOT NULL,
    description TEXT,
    shop_username VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_discount_pct CHECK (discount_percent >= 1 AND discount_percent <= 100),
    CONSTRAINT chk_discount_prices CHECK (original_price >= 0.0 AND discounted_price >= 0.0)
) ENGINE=InnoDB;

-- 15. Transaction Records Table (Platform Audit Trail & Immutable Ledger)
CREATE TABLE IF NOT EXISTS transaction_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    performed_by VARCHAR(100) NOT NULL,
    related_entity VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 16. In-App Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_username VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO', -- 'EXPIRY_WARNING', 'DONATION', 'EXCHANGE', 'SYSTEM'
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 17. Audit Logs Table (Regulatory & Security Tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    performed_by VARCHAR(100) NOT NULL,
    action_details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
