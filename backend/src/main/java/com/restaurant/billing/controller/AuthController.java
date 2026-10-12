package com.restaurant.billing.controller;

import com.restaurant.billing.dto.AuthResponse;
import com.restaurant.billing.dto.LoginRequest;
import com.restaurant.billing.dto.SignupRequest;
import com.restaurant.billing.dto.UserResponse;
import com.restaurant.billing.entity.User;
import com.restaurant.billing.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication and session context")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT bearer token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    @Operation(summary = "Register new staff/user and issue JWT bearer token")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Retrieve current authenticated user profile")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = authService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new UserResponse(user));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user and invalidate client session")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}
