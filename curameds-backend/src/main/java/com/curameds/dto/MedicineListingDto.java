package com.curameds.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicineListingDto {
    private Long id;
    private String name;
    private String manufacturer;
    private String batchNumber;
    private LocalDate expiryDate;
    private Integer quantity;
    private String status;
    private String verificationStatus;
    private Long ownerId;
}
