package com.zenvehughub.server.owner;

import com.zenvehughub.server.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;

    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public List<OwnerResponse> findAll() {
        return ownerRepository.findAll().stream().map(OwnerResponse::from).toList();
    }

    public Owner create(String name) {
        return ownerRepository.save(new Owner(name));
    }

    public Owner getById(Long id) {
        return ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + id));
    }
}
