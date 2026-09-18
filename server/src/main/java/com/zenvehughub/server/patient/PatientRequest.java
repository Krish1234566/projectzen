package com.zenvehughub.server.patient;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record PatientRequest(
        @NotBlank String petName,
        @NotBlank String species,
        String breed,
        String sex,
        LocalDate dob,
        Double weight,
        String alerts,
        Long ownerId,
        String ownerName
) {
}
