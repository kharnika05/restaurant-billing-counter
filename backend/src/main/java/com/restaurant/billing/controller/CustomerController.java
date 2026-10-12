package com.restaurant.billing.controller;

import com.restaurant.billing.dto.CustomerDto;
import com.restaurant.billing.dto.OrderResponse;
import com.restaurant.billing.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customer Management", description = "Endpoints for managing guest and registered customer records")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Search and list customer profiles")
    public ResponseEntity<List<CustomerDto>> getCustomers(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(customerService.getAllCustomers(query));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Get specific customer profile")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Register customer profile")
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CustomerDto dto) {
        return ResponseEntity.ok(customerService.createCustomer(dto));
    }

    @GetMapping("/{id}/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Get customer's past dining and billing order history")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getOrdersByCustomer(id));
    }
}
