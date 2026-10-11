package com.curameds.enums;

public enum Role {
    PATIENT,
    DONOR,
    MEDICAL_SHOP,
    MEDICALSHOP,
    NGO,
    FAMILY_MEMBER,
    FAMILYMEMBER,
    ADMIN;

    public static Role fromString(String val) {
        if (val == null || val.trim().isEmpty()) {
            return PATIENT;
        }
        String normalized = val.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        for (Role r : values()) {
            if (r.name().equals(normalized)) {
                return r;
            }
        }
        // Check without underscores
        String noUnderscore = normalized.replace("_", "");
        for (Role r : values()) {
            if (r.name().replace("_", "").equals(noUnderscore)) {
                return r;
            }
        }
        return PATIENT;
    }
}
