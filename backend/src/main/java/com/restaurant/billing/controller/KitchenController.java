package com.restaurant.billing.controller;

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
@RequestMapping("/api/kitchen")
@Tag(name = "Kitchen Display System (KDS)", description = "Endpoints for kitchen operations and order preparation")
public class KitchenController {

    private final OrderService orderService;

    public KitchenController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'KITCHEN_STAFF')")
    @Operation(summary = "Get active kitchen orders (CONFIRMED, PREPARING, READY)")
    public ResponseEntity<List<OrderResponse>> getActiveKitchenOrders() {
        return ResponseEntity.ok(orderService.getActiveKitchenOrders());
    }

    @PatchMapping("/orders/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'KITCHEN_STAFF')")
    @Operation(summary = "Advance kitchen order preparation status")
    public ResponseEntity<OrderResponse> updatePreparationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }
}
