package com.restaurant.billing.controller;

import com.restaurant.billing.dto.BillResponse;
import com.restaurant.billing.dto.CreateBillRequest;
import com.restaurant.billing.entity.Bill;
import com.restaurant.billing.exception.BadRequestException;
import com.restaurant.billing.service.BillingService;
import com.restaurant.billing.service.PdfReceiptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Bills & Invoices", description = "Endpoints for bill calculation, generation, and PDF receipts")
public class BillController {

    private final BillingService billingService;
    private final PdfReceiptService pdfReceiptService;

    public BillController(BillingService billingService, PdfReceiptService pdfReceiptService) {
        this.billingService = billingService;
        this.pdfReceiptService = pdfReceiptService;
    }

    @PostMapping({"/orders/{id}/bill", "/bills"})
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Calculate and finalize a bill for an existing order")
    public ResponseEntity<BillResponse> generateBill(
            @PathVariable(required = false) Long id,
            @Valid @RequestBody(required = false) CreateBillRequest request) {
        Long targetOrderId = id != null ? id : (request != null ? request.getOrderId() : null);
        if (targetOrderId == null) {
            throw new BadRequestException("Order ID is required to generate bill");
        }
        return ResponseEntity.ok(billingService.generateBillForOrder(targetOrderId, request));
    }

    @GetMapping("/bills")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "List all finalized restaurant bills")
    public ResponseEntity<List<BillResponse>> getAllBills() {
        return ResponseEntity.ok(billingService.getAllBills());
    }

    @GetMapping("/bills/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Retrieve specific bill by ID")
    public ResponseEntity<BillResponse> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.getBillById(id));
    }

    @GetMapping("/orders/{orderId}/bill-info")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Retrieve bill generated for a specific order")
    public ResponseEntity<BillResponse> getBillByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(billingService.getBillByOrder(orderId));
    }

    @GetMapping("/bills/{id}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'CUSTOMER')")
    @Operation(summary = "Download printable PDF tax invoice receipt")
    public ResponseEntity<byte[]> downloadBillPdf(@PathVariable Long id) {
        Bill bill = billingService.getBillEntity(id);
        byte[] pdfBytes = pdfReceiptService.generateReceiptPdf(bill);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", bill.getBillNumber() + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
