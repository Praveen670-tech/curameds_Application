# CuraMeds Database Architecture & Execution Guide

This directory contains the complete, normalized MySQL relational database implementation for **CuraMeds — Medicine Monitoring and Healthcare Platform**.

---

## 1. Directory Structure

```
database/
├── schema/
│   ├── 01_create_database.sql       # Database creation with utf8mb4 encoding
│   ├── 02_create_tables.sql         # Table definitions, foreign keys & check constraints
│   └── 03_create_indexes.sql        # Performance indexes for search, expiry & filters
├── seed/
│   ├── 01_reference_data.sql        # Master roles and therapeutic medicine categories
│   └── 02_demo_data.sql             # Development-only demo accounts, listings, and inventory
├── maintenance/
│   └── 01_expiry_monitoring.sql     # Analytical views & auto-quarantine stored procedures
└── README.md                        # Documentation and execution instructions
```

---

## 2. Execution Order

To create a clean, reproducible database, execute the SQL scripts in this exact numerical sequence:

### Using MySQL Command-Line Client
```bash
# 1. Initialize Database
mysql -u root -p < database/schema/01_create_database.sql

# 2. Create Tables & Constraints
mysql -u root -p < database/schema/02_create_tables.sql

# 3. Create Performance Indexes
mysql -u root -p < database/schema/03_create_indexes.sql

# 4. Insert Reference Master Data (Roles, Classifications)
mysql -u root -p < database/seed/01_reference_data.sql

# 5. Insert Optional Development / Demo Data
mysql -u root -p < database/seed/02_demo_data.sql

# 6. Apply Maintenance Views & Expiry Procedures
mysql -u root -p < database/maintenance/01_expiry_monitoring.sql
```

### Using MySQL Workbench
1. Open MySQL Workbench and connect to your local MySQL 8.0 instance.
2. Select **File -> Open SQL Script...**
3. Open and run each file in the sequence listed above using the **Execute (⚡)** button.

---

## 3. Database Table Catalog

| Table | Purpose | Relationships & Keys |
| :--- | :--- | :--- |
| `roles` | Lookup table for standardized platform access levels | Master table (`PATIENT`, `DONOR`, `MEDICAL_SHOP`, `NGO`, `FAMILY_MEMBER`, `ADMIN`) |
| `users` | Secure user credentials and contact attributes | Primary entity; PK `id`, unique `username` and `email` |
| `user_profiles` | Extended demographic and licensing accreditation | 1:1 relationship with `users` (`user_id` FK -> `users.id`) |
| `medicine_categories` | Therapeutic drug categories & prescription flags | Master lookup for drug groupings |
| `medicine_listings` | Active traceable surplus medicines | FK -> `users.id` (`owner_id`), batch traceability, expiry dates |
| `medicine_batches` | Lot-level manufacturing and expiry tracking | FK -> `medicine_listings.id` (`listing_id`) |
| `medicine_verifications` | Audit log of admin verification reviews | FK -> `medicine_listings.id`, FK -> `users.id` (`verifier_id`) |
| `donation_requests` | Workflow for donor surplus transfers to accredited NGOs | FK -> `medicine_listings.id`, FK -> `donor_id`, FK -> `ngo_id` |
| `exchange_requests` | Patient-to-patient barter exchanges | FK -> `medicine_listings.id`, FK -> `requester_id` |
| `inventory_records` | Pharmacy dispensary stock & buffer levels | Keyed by `shop_username`, batch tracking, min threshold |
| `inventory_movements` | Immutable audit ledger of stock additions/dispensations | FK -> `inventory_records.id` |
| `safe_disposal_requests` | Incineration protocols for expired medications | Zero-landfill green biohazard destruction requests |
| `family_members` | Caregiver dependent medication vault | Grouped by `guardian_username` |
| `discount_offers` | Subsidized pharmacy coupon codes | Maintained by `shop_username` |
| `transaction_records` | Chronological activity log across all features | Audit trail of actions with actor attribution |
| `notifications` | In-app user notifications for restock & expiry | Targeted alerts by `recipient_username` |
| `audit_logs` | Immutable regulatory & security event log | Security and compliance tracking |

---

## 4. Medicine Monitoring & Regulatory Rules

1. **Lot Traceability**: Every medicine listing contains an explicit `batch_number`, `manufacturer`, and `expiry_date`.
2. **Transfer Ineligibility**: Expired medicines (`expiry_date < CURRENT_DATE`) or unverified medicines (`verification_status != 'VERIFIED'`) are restricted from transfer or barter.
3. **Inventory Concurrency**: Quantity checks prevent negative balances (`CONSTRAINT chk_inv_qty CHECK (quantity >= 0)`).
4. **Maintenance Automation**: The stored procedure `sp_quarantine_expired_medicines()` can be run as a daily scheduled event (`EVENT`) to automatically shift expired listings to `EXPIRED`.
