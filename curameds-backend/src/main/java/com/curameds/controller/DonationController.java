package com.curameds.controller;

import com.curameds.dto.CreateDonationRequest;
import com.curameds.entity.DonationRequest;
import com.curameds.entity.MedicineListing;
import com.curameds.entity.TransactionRecord;
import com.curameds.entity.User;
import com.curameds.repository.DonationRequestRepository;
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
@RequestMapping("/api/v1/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationRequestRepository donationRepository;
    private final MedicineListingRepository listingRepository;
    private final UserRepository userRepository;
    private final TransactionRecordRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<DonationRequest>> getAllDonations() {
        return ResponseEntity.ok(donationRepository.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<DonationRequest>> getMyDonations(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        if ("NGO".equalsIgnoreCase(user.getRole().name())) {
            return ResponseEntity.ok(donationRepository.findByNgoUsername(user.getUsername()));
        }
        return ResponseEntity.ok(donationRepository.findByDonorUsername(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> createDonation(@Valid @RequestBody CreateDonationRequest req, Principal principal) {
        User donor = principal != null ? userRepository.findByUsername(principal.getName()).orElse(null) : null;
        MedicineListing listing = req.getListingId() != null ? listingRepository.findById(req.getListingId()).orElse(null) : null;
        User ngo = req.getNgoId() != null ? userRepository.findById(req.getNgoId()).orElse(null) : null;

        DonationRequest donation = new DonationRequest();
        donation.setListing(listing);
        donation.setDonor(donor);
        donation.setNgo(ngo);
        donation.setMedicineName(req.getMedicineName());
        donation.setQuantity(req.getQuantity());
        donation.setPickupAddress(req.getPickupAddress());
        donation.setNotes(req.getNotes());
        donation.setStatus("PENDING");

        DonationRequest saved = donationRepository.save(donation);

        // Update listing status if linked
        if (listing != null) {
            listing.setStatus("DONATED");
            listingRepository.save(listing);
        }

        TransactionRecord tx = new TransactionRecord();
        tx.setType("DONATION_CREATED");
        tx.setTitle("Donated " + saved.getMedicineName());
        tx.setDescription("Quantity: " + saved.getQuantity() + " | Address: " + saved.getPickupAddress());
        tx.setPerformedBy(donor != null ? donor.getUsername() : "donor");
        tx.setRelatedEntity("donation:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        DonationRequest donation = donationRepository.findById(id).orElse(null);
        if (donation == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = body.getOrDefault("status", "APPROVED");
        donation.setStatus(newStatus);

        if (principal != null && donation.getNgo() == null) {
            User current = userRepository.findByUsername(principal.getName()).orElse(null);
            if (current != null && "NGO".equalsIgnoreCase(current.getRole().name())) {
                donation.setNgo(current);
            }
        }

        DonationRequest saved = donationRepository.save(donation);

        TransactionRecord tx = new TransactionRecord();
        tx.setType("DONATION_STATUS_UPDATE");
        tx.setTitle("Donation status changed to " + newStatus);
        tx.setDescription("Medicine: " + saved.getMedicineName() + " (ID #" + saved.getId() + ")");
        tx.setPerformedBy(principal != null ? principal.getName() : "system");
        tx.setRelatedEntity("donation:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }
}
