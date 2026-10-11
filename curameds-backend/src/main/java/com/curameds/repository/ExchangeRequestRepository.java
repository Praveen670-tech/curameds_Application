package com.curameds.repository;

import com.curameds.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    List<ExchangeRequest> findByRequesterUsername(String username);
    List<ExchangeRequest> findByListingOwnerUsername(String username);
    List<ExchangeRequest> findByStatus(String status);
}
