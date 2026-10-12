package com.restaurant.billing.dto;

import com.restaurant.billing.entity.OrderItem;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long id;
    private Long menuItemId;
    private String itemName;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal lineTotal;
    private String notes;

    public OrderItemResponse() {}

    public OrderItemResponse(OrderItem item) {
        this.id = item.getId();
        if (item.getMenuItem() != null) {
            this.menuItemId = item.getMenuItem().getId();
        }
        this.itemName = item.getItemName();
        this.unitPrice = item.getUnitPrice();
        this.quantity = item.getQuantity();
        this.lineTotal = item.getLineTotal();
        this.notes = item.getNotes();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
