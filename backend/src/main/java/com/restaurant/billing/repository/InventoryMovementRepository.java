package com.restaurant.billing.repository;

import com.restaurant.billing.entity.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByIngredientIdOrderByCreatedAtDesc(Long ingredientId);
    List<InventoryMovement> findTop50ByOrderByCreatedAtDesc();
}
