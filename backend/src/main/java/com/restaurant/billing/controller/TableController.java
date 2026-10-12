package com.restaurant.billing.controller;

import com.restaurant.billing.dto.CreateTableRequest;
import com.restaurant.billing.dto.TableDto;
import com.restaurant.billing.dto.UpdateTableStatusRequest;
import com.restaurant.billing.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@Tag(name = "Table Management", description = "Endpoints for visual table layout and dining status")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'KITCHEN_STAFF', 'CUSTOMER')")
    @Operation(summary = "List all dining tables with current occupancy status")
    public ResponseEntity<List<TableDto>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new table (ADMIN only)")
    public ResponseEntity<TableDto> createTable(@Valid @RequestBody CreateTableRequest request) {
        return ResponseEntity.ok(tableService.createTable(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update table configuration (ADMIN only)")
    public ResponseEntity<TableDto> updateTable(@PathVariable Long id, @Valid @RequestBody CreateTableRequest request) {
        return ResponseEntity.ok(tableService.updateTable(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Update table availability status")
    public ResponseEntity<TableDto> updateTableStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTableStatusRequest request) {
        return ResponseEntity.ok(tableService.updateTableStatus(id, request));
    }
}
