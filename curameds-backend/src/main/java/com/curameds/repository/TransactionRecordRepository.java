package com.curameds.repository;

import com.curameds.entity.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRecordRepository extends JpaRepository<TransactionRecord, Long> {
    List<TransactionRecord> findByPerformedByOrderByCreatedAtDesc(String performedBy);
    List<TransactionRecord> findAllByOrderByCreatedAtDesc();
}
