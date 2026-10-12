package com.restaurant.billing.repository;

import com.restaurant.billing.entity.Order;
import com.restaurant.billing.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);
    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT o FROM Order o WHERE o.table.id = :tableId AND o.status NOT IN ('COMPLETED', 'CANCELLED')")
    Optional<Order> findActiveOrderByTableId(@Param("tableId") Long tableId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt <= :end")
    long countOrdersBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
