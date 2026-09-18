package com.zenvehughub.server.auth;

public record AuthResponse(String token, String email, String name) {
}
