package com.curameds.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medicine_listings")
public class MedicineListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String manufacturer;
    private String batchNumber;
    private String category;
    private String dosageForm; // e.g. "Tablet", "Capsule", "Syrup", "Injection"
    private Double price;

    @Column(nullable = false)
    private LocalDate expiryDate;

    private Integer quantity = 1;

    // Status: AVAILABLE, RESERVED, CLAIMED, EXPIRED, DISPOSED
    private String status = "AVAILABLE";

    // Verification: PENDING, VERIFIED, REJECTED
    private String verificationStatus = "PENDING";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User owner;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "AVAILABLE";
        }
        if (this.verificationStatus == null) {
            this.verificationStatus = "PENDING";
        }
    }
}
