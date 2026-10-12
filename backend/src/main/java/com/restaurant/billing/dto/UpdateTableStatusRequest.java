package com.restaurant.billing.dto;

import com.restaurant.billing.entity.TableStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateTableStatusRequest {

    @NotNull(message = "Table status is required")
    private TableStatus status;

    public UpdateTableStatusRequest() {}

    public UpdateTableStatusRequest(TableStatus status) {
        this.status = status;
    }

    public TableStatus getStatus() { return status; }
    public void setStatus(TableStatus status) { this.status = status; }
}
