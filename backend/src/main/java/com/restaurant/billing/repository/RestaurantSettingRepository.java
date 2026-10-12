package com.restaurant.billing.repository;

import com.restaurant.billing.entity.RestaurantSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantSettingRepository extends JpaRepository<RestaurantSetting, Long> {
    Optional<RestaurantSetting> findBySettingKey(String settingKey);
}
