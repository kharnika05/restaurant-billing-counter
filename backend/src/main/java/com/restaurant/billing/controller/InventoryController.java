package com.restaurant.billing.controller;

import com.restaurant.billing.dto.IngredientDto;
import com.restaurant.billing.dto.MovementDto;
import com.restaurant.billing.dto.StockAdjustmentRequest;
import com.restaurant.billing.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory & Ingredients", description = "Endpoints for ingredient tracking, stock movements, and low stock alerts")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'KITCHEN_STAFF')")
    @Operation(summary = "List all tracked ingredients and current stock")
    public ResponseEntity<List<IngredientDto>> getAllIngredients() {
        return ResponseEntity.ok(inventoryService.getAllIngredients());
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'KITCHEN_STAFF')")
    @Operation(summary = "Get list of ingredients below minimum reorder threshold")
    public ResponseEntity<List<IngredientDto>> getLowStockIngredients() {
        return ResponseEntity.ok(inventoryService.getLowStockIngredients());
    }

    @GetMapping("/movements")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get recent stock movements audit history (ADMIN only)")
    public ResponseEntity<List<MovementDto>> getRecentMovements() {
        return ResponseEntity.ok(inventoryService.getRecentMovements());
    }

    @PostMapping("/ingredients")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new raw ingredient (ADMIN only)")
    public ResponseEntity<IngredientDto> addIngredient(@Valid @RequestBody IngredientDto dto) {
        return ResponseEntity.ok(inventoryService.addIngredient(dto));
    }

    @PutMapping("/ingredients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update ingredient details (ADMIN only)")
    public ResponseEntity<IngredientDto> updateIngredient(@PathVariable Long id, @Valid @RequestBody IngredientDto dto) {
        return ResponseEntity.ok(inventoryService.updateIngredient(id, dto));
    }

    @PostMapping("/adjustments")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Record stock purchase or wastage adjustment (ADMIN only)")
    public ResponseEntity<MovementDto> recordAdjustment(@Valid @RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.ok(inventoryService.adjustStock(request));
    }
}
