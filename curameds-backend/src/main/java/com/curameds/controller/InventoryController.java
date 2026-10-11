package com.curameds.controller;

import com.curameds.dto.InventoryRequest;
import com.curameds.entity.InventoryRecord;
import com.curameds.entity.TransactionRecord;
import com.curameds.repository.InventoryRecordRepository;
import com.curameds.repository.TransactionRecordRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryRecordRepository inventoryRepository;
    private final TransactionRecordRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<InventoryRecord>> getInventory(Principal principal) {
        if (principal != null) {
            List<InventoryRecord> userItems = inventoryRepository.findByShopUsername(principal.getName());
            if (!userItems.isEmpty()) {
                return ResponseEntity.ok(userItems);
            }
        }
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> addInventoryItem(@Valid @RequestBody InventoryRequest req, Principal principal) {
        InventoryRecord item = new InventoryRecord();
        item.setMedicineName(req.getMedicineName());
        item.setBatchNumber(req.getBatchNumber());
        item.setCategory(req.getCategory() != null ? req.getCategory() : "General");
        item.setQuantity(req.getQuantity());
        item.setMinThreshold(req.getMinThreshold() != null ? req.getMinThreshold() : 10);
        item.setUnitPrice(req.getUnitPrice() != null ? req.getUnitPrice() : 0.0);
        item.setExpiryDate(req.getExpiryDate());
        item.setSupplier(req.getSupplier());
        item.setShopUsername(principal != null ? principal.getName() : "pharmacy_admin");

        InventoryRecord saved = inventoryRepository.save(item);

        TransactionRecord tx = new TransactionRecord();
        tx.setType("INVENTORY_ADDED");
        tx.setTitle("Added stock for " + saved.getMedicineName());
        tx.setDescription("Qty: " + saved.getQuantity() + " | Batch: " + saved.getBatchNumber());
        tx.setPerformedBy(item.getShopUsername());
        tx.setRelatedEntity("inventory:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventoryItem(@PathVariable Long id, @RequestBody InventoryRecord req, Principal principal) {
        InventoryRecord existing = inventoryRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        if (req.getQuantity() != null) existing.setQuantity(req.getQuantity());
        if (req.getUnitPrice() != null) existing.setUnitPrice(req.getUnitPrice());
        if (req.getMinThreshold() != null) existing.setMinThreshold(req.getMinThreshold());
        if (req.getExpiryDate() != null) existing.setExpiryDate(req.getExpiryDate());
        if (req.getSupplier() != null) existing.setSupplier(req.getSupplier());

        InventoryRecord saved = inventoryRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventoryItem(@PathVariable Long id) {
        if (!inventoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        inventoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Inventory item removed"));
    }
}
