package com.example.testing.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private long expiresIn;
    private UserResponse user;
}
