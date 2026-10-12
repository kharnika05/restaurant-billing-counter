package com.restaurant.billing.service;

import com.restaurant.billing.dto.IngredientDto;
import com.restaurant.billing.dto.MovementDto;
import com.restaurant.billing.dto.StockAdjustmentRequest;
import com.restaurant.billing.entity.*;
import com.restaurant.billing.exception.BadRequestException;
import com.restaurant.billing.exception.ResourceNotFoundException;
import com.restaurant.billing.repository.IngredientRepository;
import com.restaurant.billing.repository.InventoryMovementRepository;
import com.restaurant.billing.repository.MenuItemRecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final IngredientRepository ingredientRepository;
    private final InventoryMovementRepository movementRepository;
    private final MenuItemRecipeRepository recipeRepository;

    public InventoryService(IngredientRepository ingredientRepository,
                            InventoryMovementRepository movementRepository,
                            MenuItemRecipeRepository recipeRepository) {
        this.ingredientRepository = ingredientRepository;
        this.movementRepository = movementRepository;
        this.recipeRepository = recipeRepository;
    }

    @Transactional(readOnly = true)
    public List<IngredientDto> getAllIngredients() {
        return ingredientRepository.findAllByOrderByNameAsc().stream()
                .map(IngredientDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IngredientDto> getLowStockIngredients() {
        return ingredientRepository.findLowStockIngredients().stream()
                .map(IngredientDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MovementDto> getRecentMovements() {
        return movementRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(MovementDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public IngredientDto addIngredient(IngredientDto dto) {
        Ingredient ingredient = new Ingredient(
                dto.getName(),
                dto.getUnit(),
                dto.getCurrentStock() != null ? dto.getCurrentStock() : BigDecimal.ZERO,
                dto.getMinThreshold() != null ? dto.getMinThreshold() : new BigDecimal("5.00"),
                dto.getUnitCost() != null ? dto.getUnitCost() : BigDecimal.ZERO,
                dto.getSupplier()
        );
        return new IngredientDto(ingredientRepository.save(ingredient));
    }

    @Transactional
    public IngredientDto updateIngredient(Long id, IngredientDto dto) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));

        ingredient.setName(dto.getName());
        ingredient.setUnit(dto.getUnit());
        ingredient.setMinThreshold(dto.getMinThreshold());
        ingredient.setUnitCost(dto.getUnitCost());
        ingredient.setSupplier(dto.getSupplier());
        return new IngredientDto(ingredientRepository.save(ingredient));
    }

    @Transactional
    public MovementDto adjustStock(StockAdjustmentRequest request) {
        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + request.getIngredientId()));

        BigDecimal current = ingredient.getCurrentStock();
        BigDecimal qty = request.getQuantity();
        BigDecimal newStock;

        if (request.getMovementType() == MovementType.INWARD_PURCHASE || request.getMovementType() == MovementType.ADJUSTMENT_RETURN) {
            newStock = current.add(qty);
        } else {
            if (current.compareTo(qty) < 0) {
                throw new BadRequestException("Insufficient stock for " + ingredient.getName() + ". Available: " + current + ", Requested: " + qty);
            }
            newStock = current.subtract(qty);
        }

        ingredient.setCurrentStock(newStock);
        ingredientRepository.save(ingredient);

        InventoryMovement movement = new InventoryMovement(
                ingredient,
                request.getMovementType(),
                qty,
                current,
                newStock,
                request.getReason() != null ? request.getReason() : "Manual stock adjustment"
        );
        return new MovementDto(movementRepository.save(movement));
    }

    @Transactional
    public void deductIngredientsForOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            List<MenuItemRecipe> recipes = recipeRepository.findByMenuItemId(item.getMenuItem().getId());
            for (MenuItemRecipe recipe : recipes) {
                Ingredient ingredient = recipe.getIngredient();
                BigDecimal totalDeduction = recipe.getQuantityRequired().multiply(BigDecimal.valueOf(item.getQuantity()));
                BigDecimal prevStock = ingredient.getCurrentStock();
                BigDecimal newStock = prevStock.subtract(totalDeduction);
                if (newStock.compareTo(BigDecimal.ZERO) < 0) {
                    newStock = BigDecimal.ZERO;
                }
                ingredient.setCurrentStock(newStock);
                ingredientRepository.save(ingredient);

                InventoryMovement movement = new InventoryMovement(
                        ingredient,
                        MovementType.OUTWARD_CONSUMPTION,
                        totalDeduction,
                        prevStock,
                        newStock,
                        "Consumed for Order #" + order.getOrderNumber() + " (" + item.getItemName() + " x" + item.getQuantity() + ")"
                );
                movementRepository.save(movement);
            }
        }
    }
}
