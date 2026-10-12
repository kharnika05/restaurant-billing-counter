package com.restaurant.billing.dto;

import com.restaurant.billing.entity.MenuItemRecipe;

import java.math.BigDecimal;

public class RecipeDto {
    private Long id;
    private Long menuItemId;
    private Long ingredientId;
    private String ingredientName;
    private String unit;
    private BigDecimal quantityRequired;

    public RecipeDto() {}

    public RecipeDto(MenuItemRecipe r) {
        this.id = r.getId();
        if (r.getMenuItem() != null) {
            this.menuItemId = r.getMenuItem().getId();
        }
        if (r.getIngredient() != null) {
            this.ingredientId = r.getIngredient().getId();
            this.ingredientName = r.getIngredient().getName();
            this.unit = r.getIngredient().getUnit();
        }
        this.quantityRequired = r.getQuantityRequired();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

    public Long getIngredientId() { return ingredientId; }
    public void setIngredientId(Long ingredientId) { this.ingredientId = ingredientId; }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(BigDecimal quantityRequired) { this.quantityRequired = quantityRequired; }
}
