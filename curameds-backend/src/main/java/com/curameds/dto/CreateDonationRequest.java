package com.curameds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDonationRequest {
    private Long listingId;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private String pickupAddress;
    private String notes;
    private Long ngoId;
}
