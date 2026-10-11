package com.curameds.controller;

import com.curameds.dto.CreateExchangeRequest;
import com.curameds.entity.ExchangeRequest;
import com.curameds.entity.MedicineListing;
import com.curameds.entity.TransactionRecord;
import com.curameds.entity.User;
import com.curameds.repository.ExchangeRequestRepository;
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
@RequestMapping("/api/v1/exchanges")
@RequiredArgsConstructor
public class ExchangeController {

    private final ExchangeRequestRepository exchangeRepository;
    private final MedicineListingRepository listingRepository;
    private final UserRepository userRepository;
    private final TransactionRecordRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<ExchangeRequest>> getAllExchanges() {
        return ResponseEntity.ok(exchangeRepository.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ExchangeRequest>> getMyExchanges(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(exchangeRepository.findByRequesterUsername(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<?> createExchange(@Valid @RequestBody CreateExchangeRequest req, Principal principal) {
        User requester = principal != null ? userRepository.findByUsername(principal.getName()).orElse(null) : null;
        MedicineListing listing = req.getListingId() != null ? listingRepository.findById(req.getListingId()).orElse(null) : null;

        ExchangeRequest exchange = new ExchangeRequest();
        exchange.setListing(listing);
        exchange.setRequester(requester);
        exchange.setMedicineName(req.getMedicineName());
        exchange.setOfferedMedicine(req.getOfferedMedicine());
        exchange.setQuantity(req.getQuantity());
        exchange.setNotes(req.getNotes());
        exchange.setStatus("PENDING");

        ExchangeRequest saved = exchangeRepository.save(exchange);

        TransactionRecord tx = new TransactionRecord();
        tx.setType("EXCHANGE_REQUESTED");
        tx.setTitle("Requested exchange for " + saved.getMedicineName());
        tx.setDescription("Offered: " + saved.getOfferedMedicine() + " | Qty: " + saved.getQuantity());
        tx.setPerformedBy(requester != null ? requester.getUsername() : "patient");
        tx.setRelatedEntity("exchange:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        ExchangeRequest exchange = exchangeRepository.findById(id).orElse(null);
        if (exchange == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = body.getOrDefault("status", "APPROVED");
        exchange.setStatus(newStatus);
        ExchangeRequest saved = exchangeRepository.save(exchange);

        TransactionRecord tx = new TransactionRecord();
        tx.setType("EXCHANGE_STATUS_UPDATE");
        tx.setTitle("Exchange request " + newStatus);
        tx.setDescription("Medicine: " + saved.getMedicineName() + " (ID #" + saved.getId() + ")");
        tx.setPerformedBy(principal != null ? principal.getName() : "system");
        tx.setRelatedEntity("exchange:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }
}
