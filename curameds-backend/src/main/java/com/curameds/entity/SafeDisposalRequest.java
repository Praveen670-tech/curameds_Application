package com.curameds.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "safe_disposal_requests")
public class SafeDisposalRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String medicineName;

    private String batchNumber;
    private Integer quantity;
    private String reason; // e.g., "Expired", "Degraded / Damaged", "Discontinued"
    private String hazardLevel = "STANDARD"; // "STANDARD", "HAZARDOUS", "BIOHAZARD"
    private String facilityName;
    private String status = "PENDING"; // "PENDING", "SCHEDULED", "COLLECTED", "DISPOSED"

    private String requesterUsername;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
