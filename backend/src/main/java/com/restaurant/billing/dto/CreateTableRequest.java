package com.restaurant.billing.dto;

import com.restaurant.billing.entity.TableStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateTableRequest {

    @NotBlank(message = "Table number cannot be blank")
    private String tableNumber;

    @Min(value = 1, message = "Seating capacity must be at least 1")
    private int seatingCapacity = 4;

    private String section = "Main Dining";

    @NotNull(message = "Table status is required")
    private TableStatus status = TableStatus.AVAILABLE;

    public CreateTableRequest() {}

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public int getSeatingCapacity() { return seatingCapacity; }
    public void setSeatingCapacity(int seatingCapacity) { this.seatingCapacity = seatingCapacity; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public TableStatus getStatus() { return status; }
    public void setStatus(TableStatus status) { this.status = status; }
}
