package com.curameds.repository;

import com.curameds.entity.SafeDisposalRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SafeDisposalRequestRepository extends JpaRepository<SafeDisposalRequest, Long> {
    List<SafeDisposalRequest> findByRequesterUsername(String requesterUsername);
    List<SafeDisposalRequest> findByStatus(String status);
}
