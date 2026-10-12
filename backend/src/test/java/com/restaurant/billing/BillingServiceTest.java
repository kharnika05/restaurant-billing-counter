package com.restaurant.billing;

import com.restaurant.billing.dto.BillResponse;
import com.restaurant.billing.dto.CreateBillRequest;
import com.restaurant.billing.entity.*;
import com.restaurant.billing.repository.BillRepository;
import com.restaurant.billing.repository.OrderRepository;
import com.restaurant.billing.service.AuthService;
import com.restaurant.billing.service.BillingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BillingServiceTest {

    private BillRepository billRepository;
    private OrderRepository orderRepository;
    private AuthService fakeAuthService;
    private BillingService billingService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        billRepository = mock(BillRepository.class);
        orderRepository = mock(OrderRepository.class);

        fakeAuthService = new AuthService(null, null, null, null) {
            @Override
            public User getCurrentUser() {
                User u = new User("cashier", "pass", "Cashier Officer", Role.CASHIER, null, null);
                u.setId(2L);
                return u;
            }
        };

        billingService = new BillingService(billRepository, orderRepository, fakeAuthService);
        ReflectionTestUtils.setField(billingService, "defaultTaxRate", new BigDecimal("5.0"));

        sampleOrder = new Order("ORD-TEST-001", OrderType.DINE_IN, null, null, null);
        sampleOrder.setId(1L);

        MenuItem item1 = new MenuItem(null, "Paneer Tikka", "Desc", new BigDecimal("200.00"), true, null);
        item1.setId(10L);
        OrderItem orderItem1 = new OrderItem(item1, "Paneer Tikka", new BigDecimal("200.00"), 2, new BigDecimal("400.00"), null);

        MenuItem item2 = new MenuItem(null, "Butter Naan", "Desc", new BigDecimal("50.00"), true, null);
        item2.setId(20L);
        OrderItem orderItem2 = new OrderItem(item2, "Butter Naan", new BigDecimal("50.00"), 2, new BigDecimal("100.00"), null);

        sampleOrder.addItem(orderItem1);
        sampleOrder.addItem(orderItem2);
        sampleOrder.setSubtotal(new BigDecimal("500.00"));
    }

    @Test
    void testBillCalculationWithoutDiscount() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(billRepository.findByOrderId(1L)).thenReturn(Optional.empty());
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateBillRequest request = new CreateBillRequest(DiscountType.NONE, BigDecimal.ZERO);
        BillResponse bill = billingService.generateBillForOrder(1L, request);

        // Subtotal = 500.00
        assertEquals(new BigDecimal("500.00"), bill.getSubtotal());
        assertEquals(BigDecimal.ZERO, bill.getDiscountAmount());
        assertEquals(new BigDecimal("500.00"), bill.getTaxableAmount());

        // 5% GST = 2.5% CGST (12.50) + 2.5% SGST (12.50) = 25.00
        assertEquals(new BigDecimal("12.50"), bill.getCgstAmount());
        assertEquals(new BigDecimal("12.50"), bill.getSgstAmount());
        assertEquals(new BigDecimal("25.00"), bill.getTotalTax());

        // Grand Total = 500 + 25 = 525.00
        assertEquals(new BigDecimal("525.00"), bill.getGrandTotal());
        assertEquals(new BigDecimal("525.00"), bill.getBalanceAmount());
        assertEquals(PaymentStatus.UNPAID, bill.getPaymentStatus());
    }

    @Test
    void testBillCalculationWithPercentageDiscount() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(billRepository.findByOrderId(1L)).thenReturn(Optional.empty());
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 10% Discount on 500.00 = 50.00 discount
        CreateBillRequest request = new CreateBillRequest(DiscountType.PERCENTAGE, new BigDecimal("10.0"));
        BillResponse bill = billingService.generateBillForOrder(1L, request);

        assertEquals(new BigDecimal("500.00"), bill.getSubtotal());
        assertEquals(new BigDecimal("50.00"), bill.getDiscountAmount());
        assertEquals(new BigDecimal("450.00"), bill.getTaxableAmount());

        // 5% GST on 450.00 = 22.50 (CGST 11.25 + SGST 11.25)
        assertEquals(new BigDecimal("11.25"), bill.getCgstAmount());
        assertEquals(new BigDecimal("11.25"), bill.getSgstAmount());
        assertEquals(new BigDecimal("22.50"), bill.getTotalTax());

        // Grand Total = 450 + 22.50 = 472.50
        assertEquals(new BigDecimal("472.50"), bill.getGrandTotal());
    }

    @Test
    void testBillCalculationWithFixedDiscount() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(billRepository.findByOrderId(1L)).thenReturn(Optional.empty());
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Fixed 100.00 discount
        CreateBillRequest request = new CreateBillRequest(DiscountType.FIXED, new BigDecimal("100.00"));
        BillResponse bill = billingService.generateBillForOrder(1L, request);

        assertEquals(new BigDecimal("500.00"), bill.getSubtotal());
        assertEquals(new BigDecimal("100.00"), bill.getDiscountAmount());
        assertEquals(new BigDecimal("400.00"), bill.getTaxableAmount());

        // 5% GST on 400.00 = 20.00 (CGST 10.00 + SGST 10.00)
        assertEquals(new BigDecimal("10.00"), bill.getCgstAmount());
        assertEquals(new BigDecimal("10.00"), bill.getSgstAmount());
        assertEquals(new BigDecimal("20.00"), bill.getTotalTax());

        // Grand Total = 400 + 20.00 = 420.00
        assertEquals(new BigDecimal("420.00"), bill.getGrandTotal());
    }
}
