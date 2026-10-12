package com.restaurant.billing.repository;

import com.restaurant.billing.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);
    List<Customer> findByNameContainingIgnoreCaseOrPhoneContaining(String name, String phone);
}
