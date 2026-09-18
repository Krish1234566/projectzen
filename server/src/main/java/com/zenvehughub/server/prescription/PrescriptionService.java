package com.zenvehughub.server.prescription;

import com.zenvehughub.server.common.ResourceNotFoundException;
import com.zenvehughub.server.patient.Patient;
import com.zenvehughub.server.patient.PatientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientService patientService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, PatientService patientService) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientService = patientService;
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findAll(Long patientId) {
        return prescriptionRepository.findAllForPatient(patientId).stream()
                .map(PrescriptionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getById(Long id) {
        return PrescriptionResponse.from(prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found: " + id)));
    }

    public PrescriptionResponse create(PrescriptionRequest request) {
        Patient patient = patientService.getEntityById(request.patientId());
        Prescription prescription = new Prescription(
                patient,
                request.weight(),
                request.date() != null ? request.date() : LocalDate.now(),
                trim(request.complaint()),
                trim(request.diagnosis()),
                trim(request.notes())
        );
        return PrescriptionResponse.from(prescriptionRepository.save(prescription));
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
