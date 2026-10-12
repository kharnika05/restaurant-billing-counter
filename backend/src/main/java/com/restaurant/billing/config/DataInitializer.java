package com.restaurant.billing.config;

import com.restaurant.billing.entity.Role;
import com.restaurant.billing.entity.User;
import com.restaurant.billing.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        initializeUser("admin", "Admin@123", "System Administrator", Role.ADMIN, "admin@royalfeast.com", "+91 98765 00001");
        initializeUser("cashier", "Cashier@123", "Front Cashier Officer", Role.CASHIER, "cashier@royalfeast.com", "+91 98765 00002");
        initializeUser("chef", "Chef@123", "Head Kitchen Chef", Role.KITCHEN_STAFF, "kitchen@royalfeast.com", "+91 98765 00003");
        initializeUser("customer", "Customer@123", "Gourmet Diner", Role.CUSTOMER, "customer@royalfeast.com", "+91 98765 00004");
        log.info("System users verified and initialized successfully.");
    }

    private void initializeUser(String username, String plainPassword, String fullName, Role role, String email, String phone) {
        userRepository.findByUsername(username).ifPresentOrElse(
                user -> {
                    // Update password with actual BCrypt encoder to ensure perfect login compatibility
                    user.setPasswordHash(passwordEncoder.encode(plainPassword));
                    user.setFullName(fullName);
                    user.setRole(role);
                    user.setActive(true);
                    userRepository.save(user);
                },
                () -> {
                    User newUser = new User(username, passwordEncoder.encode(plainPassword), fullName, role, email, phone);
                    userRepository.save(newUser);
                }
        );
    }
}
