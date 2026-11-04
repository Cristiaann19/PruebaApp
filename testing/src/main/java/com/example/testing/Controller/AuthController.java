package com.example.testing.Controller;

import com.example.testing.Dto.AuthResponse;
import com.example.testing.Dto.LoginRequest;
import com.example.testing.Dto.RegisterRequest;
import com.example.testing.Service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Auth", description = "Registro e inicio de sesión de usuarios")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Registrar un nuevo usuario")
    @ApiResponse(responseCode = "201", description = "Usuario registrado correctamente")
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @Operation(summary = "Iniciar sesión")
    @ApiResponse(responseCode = "200", description = "Credenciales válidas, devuelve el token JWT")
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
