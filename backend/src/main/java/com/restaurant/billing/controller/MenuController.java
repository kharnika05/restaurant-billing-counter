package com.restaurant.billing.controller;

import com.restaurant.billing.dto.CategoryDto;
import com.restaurant.billing.dto.CreateMenuItemRequest;
import com.restaurant.billing.dto.MenuItemDto;
import com.restaurant.billing.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Menu & Categories", description = "Endpoints for managing food items and menu categories")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/categories")
    @Operation(summary = "List all menu categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new category (ADMIN only)")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto dto) {
        return ResponseEntity.ok(menuService.createCategory(dto));
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update category details (ADMIN only)")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto dto) {
        return ResponseEntity.ok(menuService.updateCategory(id, dto));
    }

    @GetMapping({"/menu", "/menu-items"})
    @Operation(summary = "Get menu items with optional category, vegetarian, and search filters")
    public ResponseEntity<List<MenuItemDto>> getMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean isVeg,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(menuService.getMenuItems(categoryId, isVeg, search));
    }

    @GetMapping("/qr-menu")
    @Operation(summary = "Public customer-facing digital menu items")
    public ResponseEntity<List<MenuItemDto>> getPublicMenu() {
        return ResponseEntity.ok(menuService.getPublicAvailableMenu());
    }

    @GetMapping({"/menu/{id}", "/menu-items/{id}"})
    @Operation(summary = "Get single menu item details")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuItemById(id));
    }

    @PostMapping("/menu")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new food item to menu (ADMIN only)")
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody CreateMenuItemRequest request) {
        return ResponseEntity.ok(menuService.createMenuItem(request));
    }

    @PutMapping("/menu/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update menu item details (ADMIN only)")
    public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable Long id, @Valid @RequestBody CreateMenuItemRequest request) {
        return ResponseEntity.ok(menuService.updateMenuItem(id, request));
    }

    @PatchMapping("/menu/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    @Operation(summary = "Toggle availability status of menu item")
    public ResponseEntity<MenuItemDto> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.toggleAvailability(id));
    }

    @DeleteMapping("/menu/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Safely archive a menu item (ADMIN only)")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
