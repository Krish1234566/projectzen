package com.zenvehughub.server.patient;

import com.zenvehughub.server.owner.Owner;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String petName;
    private String species;
    private String breed;
    private String sex;
    private LocalDate dob;
    private Double weight;

    @Column(length = 500)
    private String alerts;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id")
    private Owner owner;

    protected Patient() {
    }

    public Patient(String petName, String species, String breed, String sex, LocalDate dob, Double weight,
                   String alerts, Owner owner) {
        this.petName = petName;
        this.species = species;
        this.breed = breed;
        this.sex = sex;
        this.dob = dob;
        this.weight = weight;
        this.alerts = alerts;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getAlerts() {
        return alerts;
    }

    public void setAlerts(String alerts) {
        this.alerts = alerts;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }
}
