# CuraMeds API Contract (v2.0)

## Base URL
`http://localhost:8181/api/v1`

---

## 1. Authentication API
Base Path: `/api/v1/auth`

| Method | Endpoint | Description | Request Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| POST | `/register` | Register new user | `{ name, username, email, password, role, phone, age }` | `{ success, message, username, role }` | No |
| POST | `/login` | Authenticate and obtain JWT | `{ username, password }` | `{ token, role, username }` | No |
| GET | `/me` | Get current logged-in user profile | None | `UserDto` | Yes (Bearer Token) |

---

## 2. Medicines API
Base Path: `/api/v1/medicines`

| Method | Endpoint | Description | Query / Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | List medicines (with optional filters) | `?search=...&category=...&status=...` | `List<MedicineListing>` | No (Public View) |
| GET | `/my` | List current user's listings | None | `List<MedicineListing>` | Yes |
| GET | `/{id}` | Get single medicine details | None | `MedicineListing` | No |
| POST | `/` | Publish new medicine listing | `CreateMedicineListingRequest` | `MedicineListing` | Yes |
| PUT | `/{id}` | Update medicine listing | `MedicineListing` | `MedicineListing` | Yes |
| DELETE | `/{id}` | Delete medicine listing | None | `{ message }` | Yes |
| PATCH | `/{id}/verify` | Verify or reject medicine listing | `{ status: "VERIFIED" \| "REJECTED" }` | `MedicineListing` | Yes |

---

## 3. Donations API
Base Path: `/api/v1/donations`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | List all donations | None | `List<DonationRequest>` | No |
| GET | `/my` | List user's donations or NGO claims | None | `List<DonationRequest>` | Yes |
| POST | `/` | Create a donation request | `CreateDonationRequest` | `DonationRequest` | Yes |
| PUT | `/{id}/status` | Update donation status (Approve/Claim) | `{ status: "APPROVED" \| "COLLECTED" }` | `DonationRequest` | Yes |

---

## 4. Exchanges API
Base Path: `/api/v1/exchanges`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | List all exchange requests | None | `List<ExchangeRequest>` | Yes |
| GET | `/my` | List user's exchange requests | None | `List<ExchangeRequest>` | Yes |
| POST | `/` | Submit medicine exchange request | `CreateExchangeRequest` | `ExchangeRequest` | Yes |
| PUT | `/{id}/status` | Accept or reject exchange | `{ status: "APPROVED" \| "REJECTED" }` | `ExchangeRequest` | Yes |

---

## 5. Medical Shop Inventory API
Base Path: `/api/v1/inventory`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | Get inventory items | None | `List<InventoryRecord>` | Yes |
| POST | `/` | Add inventory item / restock | `InventoryRequest` | `InventoryRecord` | Yes |
| PUT | `/{id}` | Update stock quantity or price | `InventoryRecord` | `InventoryRecord` | Yes |
| DELETE | `/{id}` | Remove inventory item | None | `{ message }` | Yes |

---

## 6. Safe Disposal API
Base Path: `/api/v1/disposal`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | List disposal requests | None | `List<SafeDisposalRequest>` | Yes |
| POST | `/` | Submit safe disposal request | `SafeDisposalRequestDto` | `SafeDisposalRequest` | Yes |
| PUT | `/{id}/status` | Update disposal status | `{ status }` | `SafeDisposalRequest` | Yes |

---

## 7. Family Care API
Base Path: `/api/v1/family`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | List user's family members | None | `List<FamilyMember>` | Yes |
| POST | `/` | Add family member dependent | `FamilyMemberDto` | `FamilyMember` | Yes |
| DELETE | `/{id}` | Remove family member | None | `{ message }` | Yes |

---

## 8. Discount Offers API
Base Path: `/api/v1/discounts`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | List active discounts | None | `List<DiscountOffer>` | No (Public View) |
| POST | `/` | Publish new discount offer | `DiscountOfferDto` | `DiscountOffer` | Yes |

---

## 9. Administration & Dashboard API
Base Path: `/api/v1/admin`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/stats` | Platform summary statistics | None | `{ totalUsers, totalMedicines, ... }` | Yes |
| GET | `/users` | List all platform registered users | None | `List<UserDto>` | Yes |
| PATCH | `/verify-listing/{id}` | Verify medicine listing | `{ status }` | `MedicineListing` | Yes |

---

## 10. Audit History API
Base Path: `/api/v1/history`

| Method | Endpoint | Description | Body | Response Body | Auth Required |
|---|---|---|---|---|---|
| GET | `/` | Activity logs and audit history | None | `List<TransactionRecord>` | Yes |
