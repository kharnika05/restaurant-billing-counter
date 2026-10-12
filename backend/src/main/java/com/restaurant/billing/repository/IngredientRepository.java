package com.restaurant.billing.repository;

import com.restaurant.billing.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    @Query("SELECT i FROM Ingredient i WHERE i.currentStock <= i.minThreshold ORDER BY i.currentStock ASC")
    List<Ingredient> findLowStockIngredients();
    
    List<Ingredient> findAllByOrderByNameAsc();
}
