package com.restaurant.billing.service;

import com.restaurant.billing.dto.CustomerDto;
import com.restaurant.billing.dto.OrderResponse;
import com.restaurant.billing.entity.Customer;
import com.restaurant.billing.exception.ResourceNotFoundException;
import com.restaurant.billing.repository.CustomerRepository;
import com.restaurant.billing.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public CustomerService(CustomerRepository customerRepository, OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers(String query) {
        if (query != null && !query.isBlank()) {
            return customerRepository.findByNameContainingIgnoreCaseOrPhoneContaining(query, query).stream()
                    .map(CustomerDto::new)
                    .collect(Collectors.toList());
        }
        return customerRepository.findAll().stream()
                .map(CustomerDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return new CustomerDto(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CustomerDto dto) {
        Customer customer = new Customer(dto.getName(), dto.getPhone(), dto.getEmail());
        return new CustomerDto(customerRepository.save(customer));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(o -> o.getCustomer() != null && o.getCustomer().getId().equals(customerId))
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }
}
