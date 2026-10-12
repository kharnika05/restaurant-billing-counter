package com.restaurant.billing.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ingredients")
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "current_stock", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(name = "min_threshold", nullable = false, precision = 12, scale = 2)
    private BigDecimal minThreshold = new BigDecimal("5.00");

    @Column(name = "unit_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitCost = BigDecimal.ZERO;

    @Column(length = 100)
    private String supplier;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Ingredient() {}

    public Ingredient(String name, String unit, BigDecimal currentStock, BigDecimal minThreshold, BigDecimal unitCost, String supplier) {
        this.name = name;
        this.unit = unit;
        this.currentStock = currentStock;
        this.minThreshold = minThreshold;
        this.unitCost = unitCost;
        this.supplier = supplier;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isLowStock() {
        return currentStock.compareTo(minThreshold) <= 0;
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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
