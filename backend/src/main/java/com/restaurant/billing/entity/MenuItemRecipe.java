package com.restaurant.billing.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_item_recipes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"menu_item_id", "ingredient_id"})
})
public class MenuItemRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    @JsonIgnore
    private MenuItem menuItem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Column(name = "quantity_required", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantityRequired;

    public MenuItemRecipe() {}

    public MenuItemRecipe(MenuItem menuItem, Ingredient ingredient, BigDecimal quantityRequired) {
        this.menuItem = menuItem;
        this.ingredient = ingredient;
        this.quantityRequired = quantityRequired;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    public Ingredient getIngredient() { return ingredient; }
    public void setIngredient(Ingredient ingredient) { this.ingredient = ingredient; }

    public BigDecimal getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(BigDecimal quantityRequired) { this.quantityRequired = quantityRequired; }
}
