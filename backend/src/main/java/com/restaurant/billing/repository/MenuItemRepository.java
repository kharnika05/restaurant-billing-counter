package com.restaurant.billing.repository;

import com.restaurant.billing.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsArchivedFalse();
    List<MenuItem> findByCategoryIdAndIsArchivedFalse(Long categoryId);
    List<MenuItem> findByIsAvailableTrueAndIsArchivedFalse();
    
    @Query("SELECT m FROM MenuItem m WHERE m.isArchived = false AND " +
           "(:categoryId IS NULL OR m.category.id = :categoryId) AND " +
           "(:isVeg IS NULL OR m.isVeg = :isVeg) AND " +
           "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<MenuItem> searchMenuItems(@Param("categoryId") Long categoryId,
                                   @Param("isVeg") Boolean isVeg,
                                   @Param("search") String search);
}
