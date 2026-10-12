package com.restaurant.billing.controller;

import com.restaurant.billing.dto.RestaurantSettingDto;
import com.restaurant.billing.entity.RestaurantSetting;
import com.restaurant.billing.repository.RestaurantSettingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Restaurant Settings", description = "Endpoints for restaurant branding, address, tax, and currency settings")
public class SettingsController {

    private final RestaurantSettingRepository settingRepository;

    public SettingsController(RestaurantSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @GetMapping
    @Operation(summary = "Get all restaurant configuration settings")
    public ResponseEntity<List<RestaurantSettingDto>> getAllSettings() {
        return ResponseEntity.ok(settingRepository.findAll().stream()
                .map(RestaurantSettingDto::new)
                .collect(Collectors.toList()));
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update setting value (ADMIN only)")
    public ResponseEntity<RestaurantSettingDto> updateSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> body) {
        String value = body.get("value");
        RestaurantSetting setting = settingRepository.findBySettingKey(key)
                .orElseGet(() -> new RestaurantSetting(key, value, key));
        setting.setSettingValue(value);
        return ResponseEntity.ok(new RestaurantSettingDto(settingRepository.save(setting)));
    }
}
