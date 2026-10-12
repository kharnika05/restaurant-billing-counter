package com.restaurant.billing.dto;

import com.restaurant.billing.entity.PaymentMethod;

import java.math.BigDecimal;

public class PaymentMethodReportDto {
    private PaymentMethod method;
    private long count;
    private BigDecimal totalAmount;

    public PaymentMethodReportDto() {}

    public PaymentMethodReportDto(PaymentMethod method, long count, BigDecimal totalAmount) {
        this.method = method;
        this.count = count;
        this.totalAmount = totalAmount;
    }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
