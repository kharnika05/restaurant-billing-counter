package com.restaurant.billing.dto;

import java.math.BigDecimal;

public class SalesReportDto {
    private String dateLabel;
    private BigDecimal grossSales;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal netSales;
    private long orderCount;

    public SalesReportDto() {}

    public SalesReportDto(String dateLabel, BigDecimal grossSales, BigDecimal discountAmount, BigDecimal taxAmount, BigDecimal netSales, long orderCount) {
        this.dateLabel = dateLabel;
        this.grossSales = grossSales;
        this.discountAmount = discountAmount;
        this.taxAmount = taxAmount;
        this.netSales = netSales;
        this.orderCount = orderCount;
    }

    public String getDateLabel() { return dateLabel; }
    public void setDateLabel(String dateLabel) { this.dateLabel = dateLabel; }

    public BigDecimal getGrossSales() { return grossSales; }
    public void setGrossSales(BigDecimal grossSales) { this.grossSales = grossSales; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getNetSales() { return netSales; }
    public void setNetSales(BigDecimal netSales) { this.netSales = netSales; }

    public long getOrderCount() { return orderCount; }
    public void setOrderCount(long orderCount) { this.orderCount = orderCount; }
}
