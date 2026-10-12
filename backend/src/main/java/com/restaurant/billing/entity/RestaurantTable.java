package com.restaurant.billing.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_tables")
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", nullable = false, unique = true, length = 20)
    private String tableNumber;

    @Column(name = "seating_capacity", nullable = false)
    private int seatingCapacity = 4;

    @Column(nullable = false, length = 50)
    private String section = "Main Dining";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TableStatus status = TableStatus.AVAILABLE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RestaurantTable() {}

    public RestaurantTable(String tableNumber, int seatingCapacity, String section, TableStatus status) {
        this.tableNumber = tableNumber;
        this.seatingCapacity = seatingCapacity;
        this.section = section;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public int getSeatingCapacity() { return seatingCapacity; }
    public void setSeatingCapacity(int seatingCapacity) { this.seatingCapacity = seatingCapacity; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public TableStatus getStatus() { return status; }
    public void setStatus(TableStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
