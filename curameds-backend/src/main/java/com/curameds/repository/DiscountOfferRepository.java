package com.curameds.repository;

import com.curameds.entity.DiscountOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscountOfferRepository extends JpaRepository<DiscountOffer, Long> {
    List<DiscountOffer> findByStatus(String status);
    List<DiscountOffer> findByShopUsername(String shopUsername);
}
