# CuraMeds

Medicine Monitoring and Healthcare Platform

## Structure
- `curameds-frontend`: Angular 18 application with Premium UI. Runs on `http://localhost:4300`.
- `curameds-backend`: Spring Boot 3 Java application. Runs on `http://localhost:8181`.
- `database/schema.sql`: Initial setup for MySQL schema.
- `docs/api-contract.md`: The agreed REST API endpoints.

## Prerequisites
- Java 17+
- Node.js 18+ and `npm`
- MySQL 8+

## Database Setup
1. Open MySQL terminal or UI client.
2. Run the DB script: `source database/schema.sql`.
3. Set your environment variables or adjust `curameds-backend/src/main/resources/application.yml`.
   - `DB_USER`
   - `DB_PASSWORD`

## Launch Backend
```bash
cd curameds-backend
./mvnw clean package -DskipTests
java -jar target/curameds-backend-0.0.1-SNAPSHOT.jar
```
Or simply use:
```bash
cd curameds-backend
./mvnw spring-boot:run
```

## Launch Frontend
```bash
cd curameds-frontend
npm install
npm run start
```
This runs the frontend on port `4300`. Open `http://localhost:4300`.

## Architecture Details
- The frontend features premium glassmorphism layouts, robust HTTP intercepting, and role-mapping navigation for Patient, Donor, NGO, Medical Shop, Family Member.
- The backend features JWT Spring Security and REST controllers that interact with JPA Repositories to enforce validation, stock integrity, and expiration workflows."# curameds_Application" 
