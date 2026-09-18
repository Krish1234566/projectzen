package com.zenvehughub.server.prescription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @Query("""
            SELECT pr FROM Prescription pr
            JOIN FETCH pr.patient p
            JOIN FETCH p.owner
            WHERE (:patientId IS NULL OR p.id = :patientId)
            ORDER BY pr.id DESC
            """)
    List<Prescription> findAllForPatient(@Param("patientId") Long patientId);
}
