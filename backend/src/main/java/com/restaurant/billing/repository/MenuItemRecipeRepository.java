package com.restaurant.billing.repository;

import com.restaurant.billing.entity.MenuItemRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRecipeRepository extends JpaRepository<MenuItemRecipe, Long> {
    List<MenuItemRecipe> findByMenuItemId(Long menuItemId);
}
