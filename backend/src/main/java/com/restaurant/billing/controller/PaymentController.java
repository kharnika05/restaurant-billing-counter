package com.restaurant.billing.controller;

import com.restaurant.billing.dto.PaymentResponse;
import com.restaurant.billing.dto.RecordPaymentRequest;
import com.restaurant.billing.dto.RefundRequest;
import com.restaurant.billing.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Payments & Refunds", description = "Endpoints for recording payments and handling refunds")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping({"/bills/{id}/payments", "/payments/bill/{id}"})
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Record a customer payment against an unpaid or partially paid bill")
    public ResponseEntity<PaymentResponse> recordPayment(
            @PathVariable Long id,
            @Valid @RequestBody RecordPaymentRequest request) {
        return ResponseEntity.ok(paymentService.recordPayment(id, request));
    }

    @GetMapping({"/bills/{id}/payments", "/payments/bill/{id}"})
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Retrieve payment transaction history for a bill")
    public ResponseEntity<List<PaymentResponse>> getPaymentsForBill(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentsForBill(id));
    }

    @PostMapping("/payments/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Process a refund for a completed payment (ADMIN only)")
    public ResponseEntity<Void> processRefund(
            @PathVariable Long id,
            @Valid @RequestBody RefundRequest request) {
        paymentService.processRefund(id, request);
        return ResponseEntity.ok().build();
    }
}
