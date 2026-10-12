package com.restaurant.billing.repository;

import com.restaurant.billing.entity.Bill;
import com.restaurant.billing.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBillNumber(String billNumber);
    Optional<Bill> findByOrderId(Long orderId);
    List<Bill> findByPaymentStatus(PaymentStatus paymentStatus);
    List<Bill> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    List<Bill> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(b.grandTotal), 0) FROM Bill b WHERE b.paymentStatus IN ('PAID', 'PARTIALLY_PAID') AND b.createdAt >= :start AND b.createdAt <= :end")
    BigDecimal sumTotalSalesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(AVG(b.grandTotal), 0) FROM Bill b WHERE b.createdAt >= :start AND b.createdAt <= :end")
    BigDecimal avgBillAmountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(b) FROM Bill b WHERE b.createdAt >= :start AND b.createdAt <= :end")
    long countBillsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
