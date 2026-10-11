package com.curameds.controller;

import com.curameds.dto.SafeDisposalRequestDto;
import com.curameds.entity.SafeDisposalRequest;
import com.curameds.entity.TransactionRecord;
import com.curameds.repository.SafeDisposalRequestRepository;
import com.curameds.repository.TransactionRecordRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/disposal")
@RequiredArgsConstructor
public class SafeDisposalController {

    private final SafeDisposalRequestRepository disposalRepository;
    private final TransactionRecordRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<SafeDisposalRequest>> getAllDisposals(Principal principal) {
        if (principal != null) {
            List<SafeDisposalRequest> userList = disposalRepository.findByRequesterUsername(principal.getName());
            if (!userList.isEmpty()) {
                return ResponseEntity.ok(userList);
            }
        }
        return ResponseEntity.ok(disposalRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createDisposalRequest(@Valid @RequestBody SafeDisposalRequestDto req, Principal principal) {
        SafeDisposalRequest request = new SafeDisposalRequest();
        request.setMedicineName(req.getMedicineName());
        request.setBatchNumber(req.getBatchNumber());
        request.setQuantity(req.getQuantity());
        request.setReason(req.getReason() != null ? req.getReason() : "Expired Medicine");
        request.setHazardLevel(req.getHazardLevel() != null ? req.getHazardLevel() : "STANDARD");
        request.setFacilityName(req.getFacilityName() != null ? req.getFacilityName() : "Apex Green Pharma Disposal Hub");
        request.setStatus("SCHEDULED");
        request.setRequesterUsername(principal != null ? principal.getName() : "user");

        SafeDisposalRequest saved = disposalRepository.save(request);

        TransactionRecord tx = new TransactionRecord();
        tx.setType("SAFE_DISPOSAL_LOGGED");
        tx.setTitle("Safe disposal scheduled for " + saved.getMedicineName());
        tx.setDescription("Quantity: " + saved.getQuantity() + " | Facility: " + saved.getFacilityName());
        tx.setPerformedBy(saved.getRequesterUsername());
        tx.setRelatedEntity("disposal:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDisposalStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        SafeDisposalRequest req = disposalRepository.findById(id).orElse(null);
        if (req == null) {
            return ResponseEntity.notFound().build();
        }
        req.setStatus(body.getOrDefault("status", "DISPOSED"));
        return ResponseEntity.ok(disposalRepository.save(req));
    }
}
