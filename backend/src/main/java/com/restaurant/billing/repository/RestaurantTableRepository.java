package com.restaurant.billing.repository;

import com.restaurant.billing.entity.RestaurantTable;
import com.restaurant.billing.entity.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    Optional<RestaurantTable> findByTableNumber(String tableNumber);
    List<RestaurantTable> findByStatus(TableStatus status);
    List<RestaurantTable> findAllByOrderByTableNumberAsc();
}
