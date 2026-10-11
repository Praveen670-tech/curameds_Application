package com.curameds.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donation_requests")
public class DonationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "listing_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MedicineListing listing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User donor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ngo_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User ngo;

    private String medicineName;
    private Integer quantity;
    private String pickupAddress;
    private String notes;
    private String status = "PENDING"; // PENDING, APPROVED, COLLECTED, COMPLETED, CANCELLED

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
