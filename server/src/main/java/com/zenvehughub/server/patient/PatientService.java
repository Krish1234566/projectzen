package com.zenvehughub.server.patient;

import com.zenvehughub.server.common.ResourceNotFoundException;
import com.zenvehughub.server.owner.Owner;
import com.zenvehughub.server.owner.OwnerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final OwnerService ownerService;

    public PatientService(PatientRepository patientRepository, OwnerService ownerService) {
        this.patientRepository = patientRepository;
        this.ownerService = ownerService;
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> search(String species, String search) {
        String normalizedSpecies = StringUtils.hasText(species) && !species.equalsIgnoreCase("All")
                ? species
                : null;
        String normalizedSearch = StringUtils.hasText(search)
                ? "%" + search.trim().toLowerCase() + "%"
                : null;

        return patientRepository.search(normalizedSpecies, normalizedSearch).stream()
                .map(PatientResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PatientResponse getById(Long id) {
        return PatientResponse.from(findEntity(id));
    }

    @Transactional(readOnly = true)
    public Patient getEntityById(Long id) {
        return findEntity(id);
    }

    public PatientResponse create(PatientRequest request) {
        Owner owner = resolveOwner(request);
        Patient patient = new Patient(
                request.petName(),
                request.species(),
                request.breed(),
                request.sex(),
                request.dob(),
                request.weight(),
                request.alerts(),
                owner
        );
        return PatientResponse.from(patientRepository.save(patient));
    }

    public PatientResponse update(Long id, PatientRequest request) {
        Patient patient = findEntity(id);
        patient.setPetName(request.petName());
        patient.setSpecies(request.species());
        patient.setBreed(request.breed());
        patient.setSex(request.sex());
        patient.setDob(request.dob());
        patient.setWeight(request.weight());
        patient.setAlerts(request.alerts());
        patient.setOwner(resolveOwner(request));
        return PatientResponse.from(patientRepository.save(patient));
    }

    public void delete(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found: " + id);
        }
        patientRepository.deleteById(id);
    }

    private Patient findEntity(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));
    }

    private Owner resolveOwner(PatientRequest request) {
        if (request.ownerId() != null) {
            return ownerService.getById(request.ownerId());
        }
        if (StringUtils.hasText(request.ownerName())) {
            return ownerService.create(request.ownerName().trim());
        }
        throw new IllegalArgumentException("Either ownerId or ownerName is required");
    }
}
