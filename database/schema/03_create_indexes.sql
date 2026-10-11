-- ==============================================================
-- CURAMEDS MEDICINE MONITORING & TELEMEDICINE PLATFORM
-- File: 03_create_indexes.sql
-- Purpose: Performance indexes for queries, joins, and expiry filters
-- ==============================================================

USE curameds_db;

DELIMITER //

DROP PROCEDURE IF EXISTS CreateIndexSafe //

CREATE PROCEDURE CreateIndexSafe(
    IN p_table VARCHAR(64),
    IN p_index VARCHAR(64),
    IN p_columns VARCHAR(255)
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_exists
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = p_table
      AND index_name = p_index;

    IF v_exists = 0 THEN
        SET @stmt = CONCAT('CREATE INDEX ', p_index, ' ON ', p_table, ' (', p_columns, ')');
        PREPARE s FROM @stmt;
        EXECUTE s;
        DEALLOCATE PREPARE s;
    END IF;
END //

DELIMITER ;

-- 1. Users Indexes
CALL CreateIndexSafe('users', 'idx_users_role', 'role');
CALL CreateIndexSafe('users', 'idx_users_email', 'email');

-- 2. Medicine Listings Indexes
CALL CreateIndexSafe('medicine_listings', 'idx_med_status_verify', 'status, verification_status');
CALL CreateIndexSafe('medicine_listings', 'idx_med_expiry', 'expiry_date');
CALL CreateIndexSafe('medicine_listings', 'idx_med_category', 'category');
CALL CreateIndexSafe('medicine_listings', 'idx_med_batch', 'batch_number');
CALL CreateIndexSafe('medicine_listings', 'idx_med_owner', 'owner_id');

-- 3. Medicine Batches Indexes
CALL CreateIndexSafe('medicine_batches', 'idx_batch_expiry', 'expiry_date');
CALL CreateIndexSafe('medicine_batches', 'idx_batch_number', 'batch_number');

-- 4. Donation Requests Indexes
CALL CreateIndexSafe('donation_requests', 'idx_donation_status', 'status');
CALL CreateIndexSafe('donation_requests', 'idx_donation_donor', 'donor_id');
CALL CreateIndexSafe('donation_requests', 'idx_donation_ngo', 'ngo_id');

-- 5. Exchange Requests Indexes
CALL CreateIndexSafe('exchange_requests', 'idx_exchange_status', 'status');
CALL CreateIndexSafe('exchange_requests', 'idx_exchange_requester', 'requester_id');

-- 6. Pharmacy Inventory Records Indexes
CALL CreateIndexSafe('inventory_records', 'idx_inv_shop', 'shop_username');
CALL CreateIndexSafe('inventory_records', 'idx_inv_expiry', 'expiry_date');
CALL CreateIndexSafe('inventory_records', 'idx_inv_qty_threshold', 'quantity, min_threshold');

-- 7. Inventory Movements Indexes
CALL CreateIndexSafe('inventory_movements', 'idx_mov_inv_id', 'inventory_id');
CALL CreateIndexSafe('inventory_movements', 'idx_mov_type', 'movement_type');

-- 8. Safe Disposal Requests Indexes
CALL CreateIndexSafe('safe_disposal_requests', 'idx_disposal_user', 'requester_username');
CALL CreateIndexSafe('safe_disposal_requests', 'idx_disposal_status', 'status');

-- 9. Family Care Indexes
CALL CreateIndexSafe('family_members', 'idx_family_guardian', 'guardian_username');

-- 10. Discount Offers Indexes
CALL CreateIndexSafe('discount_offers', 'idx_discount_status_date', 'status, valid_until');
CALL CreateIndexSafe('discount_offers', 'idx_discount_shop', 'shop_username');

-- 11. Transaction Records & Notifications Indexes
CALL CreateIndexSafe('transaction_records', 'idx_tx_performed_by', 'performed_by');
CALL CreateIndexSafe('transaction_records', 'idx_tx_type', 'type');
CALL CreateIndexSafe('transaction_records', 'idx_tx_created', 'created_at');
CALL CreateIndexSafe('notifications', 'idx_notif_recipient', 'recipient_username, is_read');

-- Cleanup helper procedure
DROP PROCEDURE IF EXISTS CreateIndexSafe;
