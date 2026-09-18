package com.zenvehughub.server.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("""
            SELECT p FROM Patient p
            JOIN FETCH p.owner o
            WHERE (:species IS NULL OR p.species = :species)
            AND (:search IS NULL
                 OR LOWER(p.petName) LIKE :search
                 OR LOWER(o.name) LIKE :search)
            ORDER BY p.id DESC
            """)
    List<Patient> search(@Param("species") String species, @Param("search") String search);
}
