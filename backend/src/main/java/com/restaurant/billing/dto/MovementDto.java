package com.restaurant.billing.dto;

import com.restaurant.billing.entity.InventoryMovement;
import com.restaurant.billing.entity.MovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovementDto {
    private Long id;
    private Long ingredientId;
    private String ingredientName;
    private MovementType movementType;
    private BigDecimal quantity;
    private BigDecimal previousStock;
    private BigDecimal newStock;
    private String reason;
    private LocalDateTime createdAt;

    public MovementDto() {}

    public MovementDto(InventoryMovement m) {
        this.id = m.getId();
        if (m.getIngredient() != null) {
            this.ingredientId = m.getIngredient().getId();
            this.ingredientName = m.getIngredient().getName();
        }
        this.movementType = m.getMovementType();
        this.quantity = m.getQuantity();
        this.previousStock = m.getPreviousStock();
        this.newStock = m.getNewStock();
        this.reason = m.getReason();
        this.createdAt = m.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIngredientId() { return ingredientId; }
    public void setIngredientId(Long ingredientId) { this.ingredientId = ingredientId; }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }

    public MovementType getMovementType() { return movementType; }
    public void setMovementType(MovementType movementType) { this.movementType = movementType; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getPreviousStock() { return previousStock; }
    public void setPreviousStock(BigDecimal previousStock) { this.previousStock = previousStock; }

    public BigDecimal getNewStock() { return newStock; }
    public void setNewStock(BigDecimal newStock) { this.newStock = newStock; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
