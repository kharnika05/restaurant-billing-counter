package com.restaurant.billing.controller;

import com.restaurant.billing.dto.DashboardSummaryDto;
import com.restaurant.billing.dto.SalesReportDto;
import com.restaurant.billing.dto.TopSellingItemDto;
import com.restaurant.billing.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Endpoints for restaurant dashboard KPIs and live operational summaries")
public class DashboardController {

    private final ReportService reportService;

    public DashboardController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Get primary dashboard KPIs (today sales, orders, pending, low stock)")
    public ResponseEntity<DashboardSummaryDto> getSummary() {
        return ResponseEntity.ok(reportService.getDashboardSummary());
    }

    @GetMapping("/sales")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get daily revenue timeline (default: last 7 days)")
    public ResponseEntity<List<SalesReportDto>> getSalesTrend(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(reportService.getDailySalesReport(days));
    }

    @GetMapping("/top-items")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Get best-selling menu items")
    public ResponseEntity<List<TopSellingItemDto>> getTopItems(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(reportService.getTopSellingItems(limit));
    }
}
