package com.curameds.repository;

import com.curameds.entity.MedicineListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicineListingRepository extends JpaRepository<MedicineListing, Long> {
    List<MedicineListing> findByOwnerUsername(String username);
    List<MedicineListing> findByVerificationStatus(String verificationStatus);
    List<MedicineListing> findByStatus(String status);

    @Query("SELECT m FROM MedicineListing m WHERE " +
           "(:query IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR LOWER(m.category) = LOWER(:category)) AND " +
           "(:status IS NULL OR m.status = :status)")
    List<MedicineListing> searchMedicines(@Param("query") String query,
                                          @Param("category") String category,
                                          @Param("status") String status);
}
