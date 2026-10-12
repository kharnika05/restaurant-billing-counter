package com.restaurant.billing.dto;

import com.restaurant.billing.entity.MenuCategory;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private int displayOrder;

    public CategoryDto() {}

    public CategoryDto(MenuCategory category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.displayOrder = category.getDisplayOrder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
