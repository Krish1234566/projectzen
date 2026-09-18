package com.zenvehughub.server.patient;

import java.time.LocalDate;

public record PatientResponse(
        Long id,
        String petName,
        String species,
        String breed,
        String sex,
        LocalDate dob,
        Double weight,
        String alerts,
        Long ownerId,
        String ownerName
) {

    public static PatientResponse from(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getPetName(),
                patient.getSpecies(),
                patient.getBreed(),
                patient.getSex(),
                patient.getDob(),
                patient.getWeight(),
                patient.getAlerts(),
                patient.getOwner().getId(),
                patient.getOwner().getName()
        );
    }
}
