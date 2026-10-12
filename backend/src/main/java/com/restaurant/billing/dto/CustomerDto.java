package com.restaurant.billing.dto;

import com.restaurant.billing.entity.Customer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CustomerDto {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private int totalVisits;
    private BigDecimal totalSpent;
    private LocalDateTime createdAt;

    public CustomerDto() {}

    public CustomerDto(Customer customer) {
        this.id = customer.getId();
        this.name = customer.getName();
        this.phone = customer.getPhone();
        this.email = customer.getEmail();
        this.totalVisits = customer.getTotalVisits();
        this.totalSpent = customer.getTotalSpent();
        this.createdAt = customer.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getTotalVisits() { return totalVisits; }
    public void setTotalVisits(int totalVisits) { this.totalVisits = totalVisits; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
