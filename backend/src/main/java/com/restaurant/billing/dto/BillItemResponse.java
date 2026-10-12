package com.restaurant.billing.dto;

import com.restaurant.billing.entity.BillItem;

import java.math.BigDecimal;

public class BillItemResponse {
    private Long id;
    private Long menuItemId;
    private String itemName;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal lineTotal;
    private BigDecimal taxRate;

    public BillItemResponse() {}

    public BillItemResponse(BillItem item) {
        this.id = item.getId();
        this.menuItemId = item.getMenuItemId();
        this.itemName = item.getItemName();
        this.unitPrice = item.getUnitPrice();
        this.quantity = item.getQuantity();
        this.lineTotal = item.getLineTotal();
        this.taxRate = item.getTaxRate();
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

    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }
}
