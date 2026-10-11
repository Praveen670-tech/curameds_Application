-- ==============================================================
-- CURAMEDS MEDICINE MONITORING & TELEMEDICINE PLATFORM
-- File: 01_expiry_monitoring.sql
-- Purpose: Expiry auditing, automated quarantine, and inventory threshold monitoring
-- ==============================================================

USE curameds_db;

-- 1. View: Medicines expiring within 90 days (Imminent Expiry Alert)
CREATE OR REPLACE VIEW v_imminent_expiry_medicines AS
SELECT 
    ml.id AS listing_id,
    ml.name AS medicine_name,
    ml.manufacturer,
    ml.batch_number,
    ml.category,
    ml.quantity,
    ml.expiry_date,
    DATEDIFF(ml.expiry_date, CURRENT_DATE) AS days_until_expiry,
    ml.status,
    ml.verification_status,
    u.username AS owner_username,
    u.email AS owner_email
FROM medicine_listings ml
LEFT JOIN users u ON ml.owner_id = u.id
WHERE ml.expiry_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY)
  AND ml.status = 'AVAILABLE'
ORDER BY ml.expiry_date ASC;

-- 2. View: Expired Medicines (Ineligible for Swap or Donation)
CREATE OR REPLACE VIEW v_expired_ineligible_medicines AS
SELECT 
    ml.id AS listing_id,
    ml.name AS medicine_name,
    ml.batch_number,
    ml.quantity,
    ml.expiry_date,
    DATEDIFF(CURRENT_DATE, ml.expiry_date) AS days_overdue,
    ml.status,
    u.username AS owner_username
FROM medicine_listings ml
LEFT JOIN users u ON ml.owner_id = u.id
WHERE ml.expiry_date < CURRENT_DATE;

-- 3. View: Pharmacy Low Stock Warnings (< min_threshold)
CREATE OR REPLACE VIEW v_low_stock_pharmacy_alerts AS
SELECT 
    ir.id AS inventory_id,
    ir.medicine_name,
    ir.batch_number,
    ir.quantity AS current_stock,
    ir.min_threshold AS buffer_limit,
    (ir.min_threshold - ir.quantity) AS shortfall_units,
    ir.expiry_date,
    ir.shop_username,
    ir.supplier
FROM inventory_records ir
WHERE ir.quantity <= ir.min_threshold
ORDER BY ir.quantity ASC;

-- 4. Stored Procedure: Auto-Quarantine Expired Medicines
DELIMITER //

CREATE PROCEDURE sp_quarantine_expired_medicines()
BEGIN
    DECLARE updated_count INT DEFAULT 0;

    -- Update status to EXPIRED for all past-expiry available listings
    UPDATE medicine_listings
    SET status = 'EXPIRED'
    WHERE expiry_date < CURRENT_DATE
      AND status = 'AVAILABLE';
      
    SET updated_count = ROW_COUNT();

    -- Insert audit log if any medicines were transitioned to EXPIRED
    IF updated_count > 0 THEN
        INSERT INTO audit_logs (event_type, entity_name, entity_id, performed_by, action_details)
        VALUES ('EXPIRY_AUDIT', 'medicine_listings', 'BATCH_JOB', 'SYSTEM_SCHEDULER', 
                CONCAT('Automated quarantine job marked ', updated_count, ' listings as EXPIRED.'));
    END IF;

    SELECT CONCAT('Quarantined ', updated_count, ' expired medicine listings successfully.') AS result;
END //

DELIMITER ;
