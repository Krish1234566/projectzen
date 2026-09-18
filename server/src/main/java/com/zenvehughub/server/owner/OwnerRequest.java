package com.zenvehughub.server.owner;

import jakarta.validation.constraints.NotBlank;

public record OwnerRequest(@NotBlank String name) {
}
