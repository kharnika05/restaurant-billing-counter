package com.restaurant.billing.dto;

import java.math.BigDecimal;

public class TopSellingItemDto {
    private String itemName;
    private long quantitySold;
    private BigDecimal totalRevenue;

    public TopSellingItemDto() {}

    public TopSellingItemDto(String itemName, long quantitySold, BigDecimal totalRevenue) {
        this.itemName = itemName;
        this.quantitySold = quantitySold;
        this.totalRevenue = totalRevenue;
    }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public long getQuantitySold() { return quantitySold; }
    public void setQuantitySold(long quantitySold) { this.quantitySold = quantitySold; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}
