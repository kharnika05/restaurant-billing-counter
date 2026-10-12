package com.restaurant.billing.dto;

import com.restaurant.billing.entity.Payment;
import com.restaurant.billing.entity.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
    private Long id;
    private Long billId;
    private String paymentNumber;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String transactionReference;
    private String status;
    private String processedBy;
    private LocalDateTime createdAt;

    public PaymentResponse() {}

    public PaymentResponse(Payment payment) {
        this.id = payment.getId();
        if (payment.getBill() != null) {
            this.billId = payment.getBill().getId();
        }
        this.paymentNumber = payment.getPaymentNumber();
        this.amount = payment.getAmount();
        this.paymentMethod = payment.getPaymentMethod();
        this.transactionReference = payment.getTransactionReference();
        this.status = payment.getStatus();
        if (payment.getProcessedBy() != null) {
            this.processedBy = payment.getProcessedBy().getFullName();
        }
        this.createdAt = payment.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBillId() { return billId; }
    public void setBillId(Long billId) { this.billId = billId; }

    public String getPaymentNumber() { return paymentNumber; }
    public void setPaymentNumber(String paymentNumber) { this.paymentNumber = paymentNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
