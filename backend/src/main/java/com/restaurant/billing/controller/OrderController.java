package com.restaurant.billing.controller;

import com.restaurant.billing.dto.CreateOrderRequest;
import com.restaurant.billing.dto.OrderResponse;
import com.restaurant.billing.dto.UpdateOrderStatusRequest;
import com.restaurant.billing.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Endpoints for creating and managing restaurant customer orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Create a new order with items and optional table assignment")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'KITCHEN_STAFF', 'CUSTOMER')")
    @Operation(summary = "List all restaurant orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'KITCHEN_STAFF', 'CUSTOMER')")
    @Operation(summary = "Retrieve order details by ID")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'KITCHEN_STAFF')")
    @Operation(summary = "Update order lifecycle status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Cancel an order and release table")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}
