package com.curameds.entity;

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
@Table(name = "discount_offers")
public class DiscountOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String medicineName;
    private Integer discountPercent;
    private Double originalPrice;
    private Double discountedPrice;
    private LocalDate validUntil;
    private String couponCode;
    private String description;
    private String shopUsername;
    private String status = "ACTIVE"; // "ACTIVE", "EXPIRED"

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }
}
