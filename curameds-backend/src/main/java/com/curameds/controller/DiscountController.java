package com.curameds.controller;

import com.curameds.dto.DiscountOfferDto;
import com.curameds.entity.DiscountOffer;
import com.curameds.entity.TransactionRecord;
import com.curameds.repository.DiscountOfferRepository;
import com.curameds.repository.TransactionRecordRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountOfferRepository discountRepository;
    private final TransactionRecordRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<DiscountOffer>> getAllDiscounts() {
        return ResponseEntity.ok(discountRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createDiscountOffer(@Valid @RequestBody DiscountOfferDto req, Principal principal) {
        DiscountOffer offer = new DiscountOffer();
        offer.setTitle(req.getTitle());
        offer.setMedicineName(req.getMedicineName());
        offer.setDiscountPercent(req.getDiscountPercent());
        offer.setOriginalPrice(req.getOriginalPrice());
        offer.setDiscountedPrice(req.getDiscountedPrice());
        offer.setValidUntil(req.getValidUntil());
        offer.setCouponCode(req.getCouponCode() != null ? req.getCouponCode() : "CURA" + req.getDiscountPercent());
        offer.setDescription(req.getDescription());
        offer.setShopUsername(principal != null ? principal.getName() : "pharmacy_network");
        offer.setStatus("ACTIVE");

        DiscountOffer saved = discountRepository.save(offer);

        TransactionRecord tx = new TransactionRecord();
        tx.setType("DISCOUNT_OFFER_POSTED");
        tx.setTitle("Published discount for " + saved.getMedicineName());
        tx.setDescription(saved.getDiscountPercent() + "% OFF | Code: " + saved.getCouponCode());
        tx.setPerformedBy(saved.getShopUsername());
        tx.setRelatedEntity("discount:" + saved.getId());
        transactionRepository.save(tx);

        return ResponseEntity.ok(saved);
    }
}
