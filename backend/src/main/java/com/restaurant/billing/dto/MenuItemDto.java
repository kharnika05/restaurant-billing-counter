package com.restaurant.billing.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.restaurant.billing.entity.MenuItem;

import java.math.BigDecimal;

public class MenuItemDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal price;

    @JsonProperty("isVeg")
    private boolean isVeg;

    private String imageUrl;

    @JsonProperty("isAvailable")
    private boolean isAvailable;

    public MenuItemDto() {}

    public MenuItemDto(MenuItem item) {
        this.id = item.getId();
        if (item.getCategory() != null) {
            this.categoryId = item.getCategory().getId();
            this.categoryName = item.getCategory().getName();
        }
        this.name = item.getName();
        this.description = item.getDescription();
        this.price = item.getPrice();
        this.isVeg = item.isVeg();
        this.imageUrl = item.getImageUrl();
        this.isAvailable = item.isAvailable();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    @JsonProperty("isVeg")
    public boolean isVeg() { return isVeg; }
    @JsonProperty("isVeg")
    public void setVeg(boolean veg) { isVeg = veg; }

    @JsonProperty("veg")
    public boolean getVeg() { return isVeg; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    @JsonProperty("isAvailable")
    public boolean isAvailable() { return isAvailable; }
    @JsonProperty("isAvailable")
    public void setAvailable(boolean available) { isAvailable = available; }

    @JsonProperty("available")
    public boolean getAvailable() { return isAvailable; }
}
