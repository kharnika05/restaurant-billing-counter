package com.restaurant.billing.repository;

import com.restaurant.billing.entity.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> {
    List<BillItem> findByBillId(Long billId);

    @Query("SELECT bi.itemName, SUM(bi.quantity), SUM(bi.lineTotal) " +
           "FROM BillItem bi GROUP BY bi.itemName ORDER BY SUM(bi.quantity) DESC")
    List<Object[]> findTopSellingItems();
}
