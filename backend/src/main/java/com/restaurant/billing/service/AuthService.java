package com.restaurant.billing.service;

import com.restaurant.billing.dto.AuthResponse;
import com.restaurant.billing.dto.CreateUserRequest;
import com.restaurant.billing.dto.LoginRequest;
import com.restaurant.billing.dto.SignupRequest;
import com.restaurant.billing.dto.UserResponse;
import com.restaurant.billing.entity.Role;
import com.restaurant.billing.entity.User;
import com.restaurant.billing.exception.BadRequestException;
import com.restaurant.billing.exception.ResourceNotFoundException;
import com.restaurant.billing.repository.UserRepository;
import com.restaurant.billing.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim();
        User user = userRepository.findFirstMatchingLogin(identifier)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials. User not found."));

        if (!user.isActive()) {
            throw new BadRequestException("User account is deactivated.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getId(), user.getFullName());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getFullName(), user.getRole());
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            if (request.getEmail() != null && request.getEmail().contains("@")) {
                username = request.getEmail().substring(0, request.getEmail().indexOf("@")).trim();
            } else if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                username = "user_" + request.getPhone().replaceAll("[^0-9]", "");
            } else {
                username = request.getFullName().toLowerCase().replaceAll("\\s+", "_");
            }
        }

        if (userRepository.existsByUsername(username)) {
            username = username + "_" + (System.currentTimeMillis() % 10000);
        }

        User user = new User(
                username,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getRole() != null ? request.getRole() : Role.CUSTOMER,
                request.getEmail(),
                request.getPhone()
        );
        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getId(), user.getFullName());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getFullName(), user.getRole());
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByUsername(auth.getName()).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken: " + request.getUsername());
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getRole(),
                request.getEmail(),
                request.getPhone()
        );
        user = userRepository.save(user);
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(!user.isActive());
        return new UserResponse(userRepository.save(user));
    }
}
