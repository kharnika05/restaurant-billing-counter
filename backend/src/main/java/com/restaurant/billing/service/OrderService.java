package com.restaurant.billing.service;

import com.restaurant.billing.dto.CreateOrderRequest;
import com.restaurant.billing.dto.OrderItemRequest;
import com.restaurant.billing.dto.OrderResponse;
import com.restaurant.billing.dto.UpdateOrderStatusRequest;
import com.restaurant.billing.entity.*;
import com.restaurant.billing.exception.BadRequestException;
import com.restaurant.billing.exception.ResourceNotFoundException;
import com.restaurant.billing.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final CustomerRepository customerRepository;
    private final InventoryService inventoryService;
    private final AuthService authService;

    public OrderService(OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        RestaurantTableRepository tableRepository,
                        CustomerRepository customerRepository,
                        InventoryService inventoryService,
                        AuthService authService) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.tableRepository = tableRepository;
        this.customerRepository = customerRepository;
        this.inventoryService = inventoryService;
        this.authService = authService;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        RestaurantTable table = null;
        if (request.getOrderType() == OrderType.DINE_IN && request.getTableId() != null) {
            table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + request.getTableId()));

            // Check if table already has an active order
            if (orderRepository.findActiveOrderByTableId(table.getId()).isPresent()) {
                throw new BadRequestException("Table " + table.getTableNumber() + " already has an active ongoing order.");
            }
            table.setStatus(TableStatus.OCCUPIED);
            tableRepository.save(table);
        }

        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
        } else if (request.getCustomerPhone() != null && !request.getCustomerPhone().isBlank()) {
            customer = customerRepository.findByPhone(request.getCustomerPhone())
                    .orElseGet(() -> {
                        Customer newCust = new Customer(
                                request.getCustomerName() != null ? request.getCustomerName() : "Guest",
                                request.getCustomerPhone(),
                                null
                        );
                        return customerRepository.save(newCust);
                    });
        }

        User currentUser = authService.getCurrentUser();
        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = new Order(orderNumber, request.getOrderType(), table, customer, currentUser);
        order.setNotes(request.getNotes());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemReq.getMenuItemId()));

            if (!menuItem.isAvailable() || menuItem.isArchived()) {
                throw new BadRequestException("Menu item '" + menuItem.getName() + "' is currently unavailable.");
            }

            BigDecimal unitPrice = menuItem.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity())).setScale(2, RoundingMode.HALF_UP);
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = new OrderItem(menuItem, menuItem.getName(), unitPrice, itemReq.getQuantity(), lineTotal, itemReq.getNotes());
            order.addItem(orderItem);
        }

        order.setSubtotal(subtotal);
        // By default 5% GST (2.5% CGST + 2.5% SGST)
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        order.setTaxAmount(tax);
        order.setGrandTotal(subtotal.add(tax).setScale(2, RoundingMode.HALF_UP));

        Order saved = orderRepository.save(order);
        return new OrderResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return new OrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getActiveKitchenOrders() {
        List<OrderStatus> kitchenStatuses = List.of(OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY);
        return orderRepository.findByStatusInOrderByCreatedAtAsc(kitchenStatuses).stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        OrderStatus newStatus = request.getStatus();
        OrderStatus oldStatus = order.getStatus();

        // Enforce valid status transitions
        if (oldStatus == OrderStatus.COMPLETED || oldStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of an already " + oldStatus + " order.");
        }

        if (newStatus == OrderStatus.CONFIRMED && oldStatus == OrderStatus.CREATED) {
            // Deduct recipe ingredients on order confirmation
            inventoryService.deductIngredientsForOrder(order);
        }

        if (newStatus == OrderStatus.COMPLETED || newStatus == OrderStatus.CANCELLED) {
            if (order.getTable() != null) {
                order.getTable().setStatus(TableStatus.AVAILABLE);
                tableRepository.save(order.getTable());
            }
        }

        order.setStatus(newStatus);
        return new OrderResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed order.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        if (order.getTable() != null) {
            order.getTable().setStatus(TableStatus.AVAILABLE);
            tableRepository.save(order.getTable());
        }
        return new OrderResponse(orderRepository.save(order));
    }
}
