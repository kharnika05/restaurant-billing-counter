package com.restaurant.billing.repository;

import com.restaurant.billing.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBillId(Long billId);
    Optional<Payment> findByPaymentNumber(String paymentNumber);
    List<Payment> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    @Query("SELECT p.paymentMethod, COUNT(p), SUM(p.amount) FROM Payment p " +
           "WHERE p.status = 'COMPLETED' AND p.createdAt >= :start AND p.createdAt <= :end " +
           "GROUP BY p.paymentMethod")
    List<Object[]> getPaymentMethodSummary(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
