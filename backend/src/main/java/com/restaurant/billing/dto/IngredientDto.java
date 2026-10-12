package com.restaurant.billing.dto;

import com.restaurant.billing.entity.Ingredient;

import java.math.BigDecimal;

public class IngredientDto {
    private Long id;
    private String name;
    private String unit;
    private BigDecimal currentStock;
    private BigDecimal minThreshold;
    private BigDecimal unitCost;
    private String supplier;
    private boolean lowStock;

    public IngredientDto() {}

    public IngredientDto(Ingredient ingredient) {
        this.id = ingredient.getId();
        this.name = ingredient.getName();
        this.unit = ingredient.getUnit();
        this.currentStock = ingredient.getCurrentStock();
        this.minThreshold = ingredient.getMinThreshold();
        this.unitCost = ingredient.getUnitCost();
        this.supplier = ingredient.getSupplier();
        this.lowStock = ingredient.isLowStock();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getCurrentStock() { return currentStock; }
    public void setCurrentStock(BigDecimal currentStock) { this.currentStock = currentStock; }

    public BigDecimal getMinThreshold() { return minThreshold; }
    public void setMinThreshold(BigDecimal minThreshold) { this.minThreshold = minThreshold; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public boolean isLowStock() { return lowStock; }
    public void setLowStock(boolean lowStock) { this.lowStock = lowStock; }
}
