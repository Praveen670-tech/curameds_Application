package com.curameds.repository;

import com.curameds.entity.InventoryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRecordRepository extends JpaRepository<InventoryRecord, Long> {
    List<InventoryRecord> findByShopUsername(String shopUsername);
}
