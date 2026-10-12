package com.restaurant.billing.dto;

import com.restaurant.billing.entity.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public class CreateBillRequest {

    private Long orderId;
    private DiscountType discountType = DiscountType.NONE;

    @DecimalMin(value = "0.0", message = "Discount value cannot be negative")
    private BigDecimal discountValue = BigDecimal.ZERO;

    public CreateBillRequest() {}

    public CreateBillRequest(DiscountType discountType, BigDecimal discountValue) {
        this.discountType = discountType;
        this.discountValue = discountValue;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }
}
