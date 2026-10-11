package com.curameds.controller;

import com.curameds.dto.UserDto;
import com.curameds.entity.MedicineListing;
import com.curameds.entity.TransactionRecord;
import com.curameds.entity.User;
import com.curameds.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final MedicineListingRepository medicineRepository;
    private final DonationRequestRepository donationRepository;
    private final ExchangeRequestRepository exchangeRepository;
    private final SafeDisposalRequestRepository disposalRepository;
    private final DiscountOfferRepository discountRepository;
    private final TransactionRecordRepository transactionRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return getStatsResponse();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return getStatsResponse();
    }

    private ResponseEntity<Map<String, Object>> getStatsResponse() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalMedicines", medicineRepository.count());
        stats.put("totalDonations", donationRepository.count());
        stats.put("totalExchanges", exchangeRepository.count());
        stats.put("pendingVerifications", medicineRepository.findByVerificationStatus("PENDING").size());
        stats.put("totalDisposals", disposalRepository.count());
        stats.put("activeDiscounts", discountRepository.findByStatus("ACTIVE").size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getName(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getRole().name(),
                        u.getPhone(),
                        u.getAge(),
                        u.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/verify-listing/{id}")
    public ResponseEntity<?> verifyListing(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        MedicineListing listing = medicineRepository.findById(id).orElse(null);
        if (listing == null) {
            return ResponseEntity.notFound().build();
        }

        String status = body.getOrDefault("status", "VERIFIED");
        listing.setVerificationStatus(status);
        MedicineListing saved = medicineRepository.save(listing);

        TransactionRecord tx = new TransactionRecord();
        tx.setType("VERIFICATION_UPDATED");
        tx.setTitle("Listing " + saved.getName() + " set to " + status);
        tx.setDescription("Verified by Administrator: " + (principal != null ? principal.getName() : "admin"));
        tx.setPerformedBy(principal != null ? principal.getName() : "admin");
        tx.setRelatedEntity("listing:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }
}
