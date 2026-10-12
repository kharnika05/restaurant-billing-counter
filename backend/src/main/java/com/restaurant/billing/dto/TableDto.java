package com.restaurant.billing.dto;

import com.restaurant.billing.entity.RestaurantTable;
import com.restaurant.billing.entity.TableStatus;

public class TableDto {
    private Long id;
    private String tableNumber;
    private int seatingCapacity;
    private String section;
    private TableStatus status;

    public TableDto() {}

    public TableDto(RestaurantTable table) {
        this.id = table.getId();
        this.tableNumber = table.getTableNumber();
        this.seatingCapacity = table.getSeatingCapacity();
        this.section = table.getSection();
        this.status = table.getStatus();
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
}
