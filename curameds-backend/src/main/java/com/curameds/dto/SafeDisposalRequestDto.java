package com.curameds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SafeDisposalRequestDto {
    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String batchNumber;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private String reason;
    private String hazardLevel = "STANDARD";
    private String facilityName;
}
