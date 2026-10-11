package com.curameds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InventoryRequest {
    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String batchNumber;
    private String category;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private Integer minThreshold = 10;
    private Double unitPrice;
    private LocalDate expiryDate;
    private String supplier;
}
