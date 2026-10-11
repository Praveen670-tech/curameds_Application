package com.curameds.repository;

import com.curameds.entity.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
    List<DonationRequest> findByDonorUsername(String username);
    List<DonationRequest> findByNgoUsername(String username);
    List<DonationRequest> findByStatus(String status);
}
