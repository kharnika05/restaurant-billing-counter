package com.restaurant.billing.controller;

import com.restaurant.billing.dto.IngredientDto;
import com.restaurant.billing.dto.PaymentMethodReportDto;
import com.restaurant.billing.dto.SalesReportDto;
import com.restaurant.billing.dto.TopSellingItemDto;
import com.restaurant.billing.service.InventoryService;
import com.restaurant.billing.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports & Analytics", description = "Endpoints for sales, revenue, payment, and inventory reporting")
public class ReportController {

    private final ReportService reportService;
    private final InventoryService inventoryService;

    public ReportController(ReportService reportService, InventoryService inventoryService) {
        this.reportService = reportService;
        this.inventoryService = inventoryService;
    }

    @GetMapping("/sales")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get detailed sales revenue report for specified timeframe")
    public ResponseEntity<List<SalesReportDto>> getSalesReport(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(reportService.getDailySalesReport(days));
    }

    @GetMapping("/sales/export")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Export sales report to downloadable CSV file")
    public ResponseEntity<byte[]> exportSalesReportCsv(@RequestParam(defaultValue = "30") int days) {
        String csv = reportService.generateSalesReportCsv(days);
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "sales_report_" + LocalDate.now() + ".csv");
        headers.setContentLength(bytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(bytes);
    }

    @GetMapping("/top-items")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get top performing food items by revenue and quantity")
    public ResponseEntity<List<TopSellingItemDto>> getTopItems(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reportService.getTopSellingItems(limit));
    }

    @GetMapping("/payment-methods")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get payment method breakdown")
    public ResponseEntity<List<PaymentMethodReportDto>> getPaymentMethods(@RequestParam(defaultValue = "30") int days) {
        LocalDateTime start = LocalDateTime.of(LocalDate.now().minusDays(days), LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        return ResponseEntity.ok(reportService.getPaymentMethodSummary(start, end));
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get inventory critical stock reports")
    public ResponseEntity<List<IngredientDto>> getInventoryReport() {
        return ResponseEntity.ok(inventoryService.getLowStockIngredients());
    }
}
