package com.curameds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateMedicineListingRequest {
    @NotBlank(message = "Medicine name is required")
    private String name;

    private String manufacturer;
    private String batchNumber;
    private String category;
    private String dosageForm;
    private Double price;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private Integer quantity = 1;
}
