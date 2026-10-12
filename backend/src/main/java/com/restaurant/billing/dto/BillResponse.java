package com.restaurant.billing.dto;

import com.restaurant.billing.entity.Bill;
import com.restaurant.billing.entity.DiscountType;
import com.restaurant.billing.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BillResponse {
    private Long id;
    private String billNumber;
    private Long orderId;
    private String orderNumber;
    private String orderType;
    private String tableNumber;
    private String customerName;
    private String customerPhone;
    private String cashierName;
    private BigDecimal subtotal;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal taxableAmount;
    private BigDecimal cgstRate;
    private BigDecimal cgstAmount;
    private BigDecimal sgstRate;
    private BigDecimal sgstAmount;
    private BigDecimal totalTax;
    private BigDecimal grandTotal;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private List<BillItemResponse> items;

    public BillResponse() {}

    public BillResponse(Bill bill) {
        this.id = bill.getId();
        this.billNumber = bill.getBillNumber();
        if (bill.getOrder() != null) {
            this.orderId = bill.getOrder().getId();
            this.orderNumber = bill.getOrder().getOrderNumber();
            this.orderType = bill.getOrder().getOrderType().name();
            if (bill.getOrder().getTable() != null) {
                this.tableNumber = bill.getOrder().getTable().getTableNumber();
            }
            if (bill.getOrder().getCustomer() != null) {
                this.customerName = bill.getOrder().getCustomer().getName();
                this.customerPhone = bill.getOrder().getCustomer().getPhone();
            }
        }
        if (bill.getCashier() != null) {
            this.cashierName = bill.getCashier().getFullName();
        }
        this.subtotal = bill.getSubtotal();
        this.discountType = bill.getDiscountType();
        this.discountValue = bill.getDiscountValue();
        this.discountAmount = bill.getDiscountAmount();
        this.taxableAmount = bill.getTaxableAmount();
        this.cgstRate = bill.getCgstRate();
        this.cgstAmount = bill.getCgstAmount();
        this.sgstRate = bill.getSgstRate();
        this.sgstAmount = bill.getSgstAmount();
        this.totalTax = bill.getTotalTax();
        this.grandTotal = bill.getGrandTotal();
        this.paidAmount = bill.getPaidAmount();
        this.balanceAmount = bill.getBalanceAmount();
        this.paymentStatus = bill.getPaymentStatus();
        this.createdAt = bill.getCreatedAt();
        if (bill.getBillItems() != null) {
            this.items = bill.getBillItems().stream()
                    .map(BillItemResponse::new)
                    .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCashierName() { return cashierName; }
    public void setCashierName(String cashierName) { this.cashierName = cashierName; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxableAmount() { return taxableAmount; }
    public void setTaxableAmount(BigDecimal taxableAmount) { this.taxableAmount = taxableAmount; }

    public BigDecimal getCgstRate() { return cgstRate; }
    public void setCgstRate(BigDecimal cgstRate) { this.cgstRate = cgstRate; }

    public BigDecimal getCgstAmount() { return cgstAmount; }
    public void setCgstAmount(BigDecimal cgstAmount) { this.cgstAmount = cgstAmount; }

    public BigDecimal getSgstRate() { return sgstRate; }
    public void setSgstRate(BigDecimal sgstRate) { this.sgstRate = sgstRate; }

    public BigDecimal getSgstAmount() { return sgstAmount; }
    public void setSgstAmount(BigDecimal sgstAmount) { this.sgstAmount = sgstAmount; }

    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal totalTax) { this.totalTax = totalTax; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public BigDecimal getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<BillItemResponse> getItems() { return items; }
    public void setItems(List<BillItemResponse> items) { this.items = items; }
}
