package com.curameds.controller;

import com.curameds.dto.CreateMedicineListingRequest;
import com.curameds.entity.MedicineListing;
import com.curameds.entity.TransactionRecord;
import com.curameds.entity.User;
import com.curameds.repository.MedicineListingRepository;
import com.curameds.repository.TransactionRecordRepository;
import com.curameds.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineListingRepository repository;
    private final UserRepository userRepository;
    private final TransactionRecordRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<MedicineListing>> getAllMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        if (search != null || category != null || status != null) {
            return ResponseEntity.ok(repository.searchMedicines(
                    search != null && !search.trim().isEmpty() ? search : null,
                    category != null && !category.trim().isEmpty() ? category : null,
                    status != null && !status.trim().isEmpty() ? status : null
            ));
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<MedicineListing>> getMyMedicines(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(repository.findByOwnerUsername(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicineById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createListing(@Valid @RequestBody CreateMedicineListingRequest req, Principal principal) {
        User user = null;
        if (principal != null) {
            user = userRepository.findByUsername(principal.getName()).orElse(null);
        }

        MedicineListing listing = new MedicineListing();
        listing.setName(req.getName());
        listing.setManufacturer(req.getManufacturer());
        listing.setBatchNumber(req.getBatchNumber());
        listing.setCategory(req.getCategory() != null ? req.getCategory() : "General");
        listing.setDosageForm(req.getDosageForm() != null ? req.getDosageForm() : "Tablet");
        listing.setPrice(req.getPrice() != null ? req.getPrice() : 0.0);
        listing.setExpiryDate(req.getExpiryDate());
        listing.setQuantity(req.getQuantity() != null ? req.getQuantity() : 1);
        listing.setStatus("AVAILABLE");
        listing.setVerificationStatus("PENDING");
        listing.setOwner(user);

        MedicineListing saved = repository.save(listing);

        // Record audit transaction
        TransactionRecord tx = new TransactionRecord();
        tx.setType("MEDICINE_LISTED");
        tx.setTitle("Listed " + saved.getName());
        tx.setDescription("Quantity: " + saved.getQuantity() + ", Batch: " + saved.getBatchNumber());
        tx.setPerformedBy(user != null ? user.getUsername() : "anonymous");
        tx.setRelatedEntity("listing:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateListing(@PathVariable Long id, @RequestBody MedicineListing req, Principal principal) {
        MedicineListing existing = repository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        if (req.getName() != null) existing.setName(req.getName());
        if (req.getManufacturer() != null) existing.setManufacturer(req.getManufacturer());
        if (req.getBatchNumber() != null) existing.setBatchNumber(req.getBatchNumber());
        if (req.getCategory() != null) existing.setCategory(req.getCategory());
        if (req.getDosageForm() != null) existing.setDosageForm(req.getDosageForm());
        if (req.getPrice() != null) existing.setPrice(req.getPrice());
        if (req.getExpiryDate() != null) existing.setExpiryDate(req.getExpiryDate());
        if (req.getQuantity() != null) existing.setQuantity(req.getQuantity());
        if (req.getStatus() != null) existing.setStatus(req.getStatus());

        return ResponseEntity.ok(repository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Medicine listing deleted successfully"));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<?> verifyListing(@PathVariable Long id, @RequestBody Map<String, String> body) {
        MedicineListing listing = repository.findById(id).orElse(null);
        if (listing == null) {
            return ResponseEntity.notFound().build();
        }
        String status = body.getOrDefault("status", "VERIFIED");
        listing.setVerificationStatus(status);
        MedicineListing saved = repository.save(listing);
        return ResponseEntity.ok(saved);
    }
}
