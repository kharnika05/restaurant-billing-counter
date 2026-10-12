package com.restaurant.billing;

import com.restaurant.billing.dto.CreateOrderRequest;
import com.restaurant.billing.dto.OrderItemRequest;
import com.restaurant.billing.dto.OrderResponse;
import com.restaurant.billing.entity.MenuItem;
import com.restaurant.billing.entity.OrderStatus;
import com.restaurant.billing.entity.OrderType;
import com.restaurant.billing.entity.Role;
import com.restaurant.billing.entity.User;
import com.restaurant.billing.repository.CustomerRepository;
import com.restaurant.billing.repository.MenuItemRepository;
import com.restaurant.billing.repository.OrderRepository;
import com.restaurant.billing.repository.RestaurantTableRepository;
import com.restaurant.billing.service.AuthService;
import com.restaurant.billing.service.InventoryService;
import com.restaurant.billing.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class OrderServiceTest {

    private OrderRepository orderRepository;
    private MenuItemRepository menuItemRepository;
    private RestaurantTableRepository tableRepository;
    private CustomerRepository customerRepository;
    private InventoryService fakeInventoryService;
    private AuthService fakeAuthService;
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderRepository = mock(OrderRepository.class);
        menuItemRepository = mock(MenuItemRepository.class);
        tableRepository = mock(RestaurantTableRepository.class);
        customerRepository = mock(CustomerRepository.class);

        fakeInventoryService = new InventoryService(null, null, null);
        fakeAuthService = new AuthService(null, null, null, null) {
            @Override
            public User getCurrentUser() {
                User u = new User("admin", "pass", "Administrator", Role.ADMIN, null, null);
                u.setId(1L);
                return u;
            }
        };

        orderService = new OrderService(
                orderRepository,
                menuItemRepository,
                tableRepository,
                customerRepository,
                fakeInventoryService,
                fakeAuthService
        );
    }

    @Test
    void testCreateOrderWithServerSidePriceCalculation() {
        MenuItem item = new MenuItem(null, "Crispy Corn", "Desc", new BigDecimal("190.00"), true, null);
        item.setId(5L);
        item.setAvailable(true);

        when(menuItemRepository.findById(5L)).thenReturn(Optional.of(item));
        when(orderRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        CreateOrderRequest request = new CreateOrderRequest();
        request.setOrderType(OrderType.TAKEAWAY);
        request.setItems(List.of(new OrderItemRequest(5L, 2, "Less spicy")));

        OrderResponse response = orderService.createOrder(request);

        assertNotNull(response);
        assertEquals(OrderStatus.CREATED, response.getStatus());
        assertEquals(new BigDecimal("380.00"), response.getSubtotal()); // 190.00 * 2
        assertEquals(new BigDecimal("19.00"), response.getTaxAmount()); // 5% of 380 = 19.00
        assertEquals(new BigDecimal("399.00"), response.getGrandTotal());
    }
}
