package com.zenvehughub.server.owner;

public record OwnerResponse(Long id, String name) {

    public static OwnerResponse from(Owner owner) {
        return new OwnerResponse(owner.getId(), owner.getName());
    }
}
