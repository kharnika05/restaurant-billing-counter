package com.restaurant.billing.dto;

import com.restaurant.billing.entity.RestaurantSetting;

public class RestaurantSettingDto {
    private String key;
    private String value;
    private String description;

    public RestaurantSettingDto() {}

    public RestaurantSettingDto(RestaurantSetting setting) {
        this.key = setting.getSettingKey();
        this.value = setting.getSettingValue();
        this.description = setting.getDescription();
    }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
