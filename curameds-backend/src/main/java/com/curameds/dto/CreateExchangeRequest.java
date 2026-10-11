package com.curameds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateExchangeRequest {
    private Long listingId;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotBlank(message = "Offered medicine is required")
    private String offeredMedicine;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private String notes;
}
