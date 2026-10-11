package com.curameds.config;

import com.curameds.entity.*;
import com.curameds.enums.Role;
import com.curameds.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MedicineListingRepository medicineRepository;
    private final InventoryRecordRepository inventoryRepository;
    private final DiscountOfferRepository discountRepository;
    private final FamilyMemberRepository familyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Upsert standard demo accounts to ensure they always match test credentials
        seedUserIfMissing("admin", "Admin Supervisor", "Admin@123", "admin@curameds.org", Role.ADMIN, "+91 9876543210", 35);
        seedUserIfMissing("patient", "Praveen N", "Patient@123", "praveen@gmail.com", Role.PATIENT, "+91 9123456789", 28);
        seedUserIfMissing("donor", "Dr. Ramesh Kumar", "Donor@123", "ramesh.donor@curameds.org", Role.DONOR, "+91 9988776655", 42);
        seedUserIfMissing("medicalshop", "Apollo City Meds", "Shop@123", "apollo.shop@curameds.org", Role.MEDICAL_SHOP, "+91 9871122334", 45);
        seedUserIfMissing("ngo_care", "Aarogya Seva Trust", "Ngo@123", "ngo@aarogya.org", Role.NGO, "+91 9765432109", 50);
        seedUserIfMissing("caregiver", "Suman Caregiver", "Care@123", "suman.care@curameds.org", Role.FAMILY_MEMBER, "+91 9845012345", 34);

        // Seed Sample Medicines if empty
        if (medicineRepository.count() == 0) {
            User owner = userRepository.findByUsername("donor").orElse(null);
            MedicineListing m1 = new MedicineListing(null, "Paracetamol 500mg", "Cipla Ltd", "BCH-2024-01", "Analgesic & Antipyretic", "Tablet", 25.0, LocalDate.now().plusMonths(14), 120, "AVAILABLE", "VERIFIED", owner, null);
            MedicineListing m2 = new MedicineListing(null, "Amoxicillin 250mg", "Sun Pharma", "BCH-2024-02", "Antibiotic", "Capsule", 65.0, LocalDate.now().plusMonths(10), 50, "AVAILABLE", "VERIFIED", owner, null);
            MedicineListing m3 = new MedicineListing(null, "Metformin 500mg", "Lupin Life", "BCH-2024-03", "Antidiabetic", "Tablet", 40.0, LocalDate.now().plusMonths(18), 90, "AVAILABLE", "VERIFIED", owner, null);
            MedicineListing m4 = new MedicineListing(null, "Cetirizine 10mg", "Dr. Reddy's", "BCH-2024-04", "Antihistamine", "Tablet", 18.0, LocalDate.now().plusMonths(8), 60, "AVAILABLE", "VERIFIED", owner, null);
            MedicineListing m5 = new MedicineListing(null, "Azithromycin 500mg", "Zydus Cadila", "BCH-2024-05", "Antibiotic", "Tablet", 110.0, LocalDate.now().plusMonths(6), 35, "AVAILABLE", "VERIFIED", owner, null);

            medicineRepository.saveAll(List.of(m1, m2, m3, m4, m5));
        }

        // Seed Inventory if empty
        if (inventoryRepository.count() == 0) {
            InventoryRecord inv1 = new InventoryRecord(null, "Paracetamol 500mg", "BCH-991", "Analgesic", 450, 50, 22.5, LocalDate.now().plusMonths(16), "Cipla Direct", "medicalshop", null);
            InventoryRecord inv2 = new InventoryRecord(null, "Atorvastatin 10mg", "BCH-992", "Cardiovascular", 80, 20, 145.0, LocalDate.now().plusMonths(12), "Sun Distributors", "medicalshop", null);
            InventoryRecord inv3 = new InventoryRecord(null, "Pantoprazole 40mg", "BCH-993", "Gastrointestinal", 15, 25, 95.0, LocalDate.now().plusMonths(9), "Alkem Lab", "medicalshop", null);

            inventoryRepository.saveAll(List.of(inv1, inv2, inv3));
        }

        // Seed Discount Offers if empty
        if (discountRepository.count() == 0) {
            DiscountOffer d1 = new DiscountOffer(null, "Senior Citizen Essential Care", "Metformin 500mg", 30, 50.0, 35.0, LocalDate.now().plusMonths(3), "CURA30", "30% subsidy on chronic maintenance diabetes medication", "medicalshop", "ACTIVE", null);
            DiscountOffer d2 = new DiscountOffer(null, "Seasonal Allergy Relief", "Cetirizine 10mg", 25, 24.0, 18.0, LocalDate.now().plusMonths(2), "RELIEF25", "Special subsidy for seasonal flu and allergy season", "medicalshop", "ACTIVE", null);
            discountRepository.saveAll(List.of(d1, d2));
        }

        // Seed Family Members if empty
        if (familyRepository.count() == 0) {
            FamilyMember f1 = new FamilyMember(null, "Radha Narayanan", "Mother", 62, "+91 9845012349", "Type-2 Diabetes, Mild Hypertension", "Metformin 500mg (Morning), Amlodipine 5mg (Evening)", "patient", null);
            familyRepository.save(f1);
        }
    }

    private void seedUserIfMissing(String username, String name, String rawPassword, String email, Role role, String phone, Integer age) {
        User user = userRepository.findByUsername(username).orElseGet(() -> {
            User u = new User();
            u.setUsername(username);
            return u;
        });
        user.setName(name);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setEmail(email);
        user.setRole(role);
        user.setPhone(phone);
        user.setAge(age);
        userRepository.save(user);
    }
}
