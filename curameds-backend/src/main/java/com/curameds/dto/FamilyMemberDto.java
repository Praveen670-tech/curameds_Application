package com.curameds.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FamilyMemberDto {
    @NotBlank(message = "Relative name is required")
    private String relativeName;

    private String relationship;
    private Integer age;
    private String contactPhone;
    private String medicalConditions;
    private String currentMedications;
}
