package com.restaurant.billing.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDto {
    private BigDecimal todaySales;
    private long todayOrderCount;
    private long totalBillsGenerated;
    private BigDecimal averageOrderValue;
    private long pendingOrders;
    private long lowStockCount;
    private List<TopSellingItemDto> topSellingItems;
    private List<OrderResponse> recentOrders;
    private List<PaymentMethodReportDto> paymentMethods;

    public DashboardSummaryDto() {}

    public BigDecimal getTodaySales() { return todaySales; }
    public void setTodaySales(BigDecimal todaySales) { this.todaySales = todaySales; }

    public long getTodayOrderCount() { return todayOrderCount; }
    public void setTodayOrderCount(long todayOrderCount) { this.todayOrderCount = todayOrderCount; }

    public long getTotalBillsGenerated() { return totalBillsGenerated; }
    public void setTotalBillsGenerated(long totalBillsGenerated) { this.totalBillsGenerated = totalBillsGenerated; }

    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }

    public List<TopSellingItemDto> getTopSellingItems() { return topSellingItems; }
    public void setTopSellingItems(List<TopSellingItemDto> topSellingItems) { this.topSellingItems = topSellingItems; }

    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }

    public List<PaymentMethodReportDto> getPaymentMethods() { return paymentMethods; }
    public void setPaymentMethods(List<PaymentMethodReportDto> paymentMethods) { this.paymentMethods = paymentMethods; }
}
