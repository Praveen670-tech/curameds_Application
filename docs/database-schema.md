# CuraMeds Database Architecture & Schema

## Database Engine
- MySQL 8.0+
- Database Name: `curameds_db`
- Default Port: `3306`

## Tables and Entity Relationships

### 1. `users`
Stores user credentials, contact information, and role assignments.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `name` (VARCHAR 255)
- `username` (VARCHAR 100, UNIQUE)
- `password` (VARCHAR 255, BCrypt hashed)
- `email` (VARCHAR 255, UNIQUE)
- `role` (VARCHAR 50) — Roles: `PATIENT`, `DONOR`, `MEDICAL_SHOP`, `NGO`, `FAMILY_MEMBER`, `ADMIN`
- `phone` (VARCHAR 50)
- `age` (INT)
- `created_at` (TIMESTAMP)

### 2. `medicine_listings`
Tracks medicines posted by individuals, donors, or shops for availability and exchange.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `name` (VARCHAR 255)
- `manufacturer` (VARCHAR 255)
- `batch_number` (VARCHAR 100)
- `category` (VARCHAR 100)
- `dosage_form` (VARCHAR 50)
- `price` (DOUBLE)
- `expiry_date` (DATE)
- `quantity` (INT)
- `status` (VARCHAR 50) — `AVAILABLE`, `RESERVED`, `DONATED`, `EXPIRED`, `DISPOSED`
- `verification_status` (VARCHAR 50) — `PENDING`, `VERIFIED`, `REJECTED`
- `owner_id` (BIGINT, FK -> `users.id`)
- `created_at` (TIMESTAMP)

### 3. `donation_requests`
Facilitates medicine donation workflows between donors and verified NGOs.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `listing_id` (BIGINT, FK -> `medicine_listings.id`)
- `donor_id` (BIGINT, FK -> `users.id`)
- `ngo_id` (BIGINT, FK -> `users.id`)
- `medicine_name` (VARCHAR 255)
- `quantity` (INT)
- `pickup_address` (VARCHAR 500)
- `notes` (TEXT)
- `status` (VARCHAR 50) — `PENDING`, `APPROVED`, `COLLECTED`, `CANCELLED`
- `created_at` (TIMESTAMP)

### 4. `exchange_requests`
Enables patient-to-patient medicine swaps for identical value or chronic substitutions.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `listing_id` (BIGINT, FK -> `medicine_listings.id`)
- `requester_id` (BIGINT, FK -> `users.id`)
- `medicine_name` (VARCHAR 255)
- `offered_medicine` (VARCHAR 255)
- `quantity` (INT)
- `notes` (TEXT)
- `status` (VARCHAR 50) — `PENDING`, `APPROVED`, `COMPLETED`, `REJECTED`
- `created_at` (TIMESTAMP)

### 5. `inventory_records`
Maintains medical shop pharmacy stock, minimum thresholds, and expiry dates.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `medicine_name` (VARCHAR 255)
- `batch_number` (VARCHAR 100)
- `category` (VARCHAR 100)
- `quantity` (INT)
- `min_threshold` (INT)
- `unit_price` (DOUBLE)
- `expiry_date` (DATE)
- `supplier` (VARCHAR 255)
- `shop_username` (VARCHAR 100)
- `last_updated` (TIMESTAMP)

### 6. `safe_disposal_requests`
Safe pharmaceutical disposal protocols for expired or degraded medicines.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `medicine_name` (VARCHAR 255)
- `batch_number` (VARCHAR 100)
- `quantity` (INT)
- `reason` (VARCHAR 255)
- `hazard_level` (VARCHAR 50)
- `facility_name` (VARCHAR 255)
- `status` (VARCHAR 50) — `PENDING`, `SCHEDULED`, `DISPOSED`
- `requester_username` (VARCHAR 100)
- `created_at` (TIMESTAMP)

### 7. `family_members`
Enables family caregivers to monitor dependents, chronic medications, and dosage schedules.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `relative_name` (VARCHAR 255)
- `relationship` (VARCHAR 100)
- `age` (INT)
- `contact_phone` (VARCHAR 50)
- `medical_conditions` (TEXT)
- `current_medications` (TEXT)
- `guardian_username` (VARCHAR 100)
- `created_at` (TIMESTAMP)

### 8. `discount_offers`
Provides access to subsidized and discounted medicines for patients in need.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `title` (VARCHAR 255)
- `medicine_name` (VARCHAR 255)
- `discount_percent` (INT)
- `original_price` (DOUBLE)
- `discounted_price` (DOUBLE)
- `valid_until` (DATE)
- `coupon_code` (VARCHAR 50)
- `description` (TEXT)
- `shop_username` (VARCHAR 100)
- `status` (VARCHAR 50)
- `created_at` (TIMESTAMP)

### 9. `transaction_records`
Audit trail of actions across donations, exchanges, restocks, and verifications.
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `type` (VARCHAR 100)
- `title` (VARCHAR 255)
- `description` (TEXT)
- `performed_by` (VARCHAR 100)
- `related_entity` (VARCHAR 100)
- `status` (VARCHAR 50)
- `created_at` (TIMESTAMP)
