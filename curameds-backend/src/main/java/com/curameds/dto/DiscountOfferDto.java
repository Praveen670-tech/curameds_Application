package com.curameds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DiscountOfferDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotNull(message = "Discount percentage is required")
    private Integer discountPercent;

    private Double originalPrice;
    private Double discountedPrice;
    private LocalDate validUntil;
    private String couponCode;
    private String description;
}
