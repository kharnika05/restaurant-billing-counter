package com.restaurant.billing.service;

import com.restaurant.billing.dto.BillResponse;
import com.restaurant.billing.dto.CreateBillRequest;
import com.restaurant.billing.entity.*;
import com.restaurant.billing.exception.BadRequestException;
import com.restaurant.billing.exception.ResourceNotFoundException;
import com.restaurant.billing.repository.BillRepository;
import com.restaurant.billing.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
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
public class BillingService {

    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final AuthService authService;

    @Value("${app.restaurant.default-tax-rate:5.0}")
    private BigDecimal defaultTaxRate;

    public BillingService(BillRepository billRepository,
                          OrderRepository orderRepository,
                          AuthService authService) {
        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.authService = authService;
    }

    @Transactional
    public BillResponse generateBillForOrder(Long orderId, CreateBillRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot generate a bill for a cancelled order.");
        }

        if (billRepository.findByOrderId(orderId).isPresent()) {
            throw new BadRequestException("A bill has already been finalized for Order " + order.getOrderNumber());
        }

        User cashier = authService.getCurrentUser();
        String billNumber = "BILL-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Bill bill = new Bill();
        bill.setBillNumber(billNumber);
        bill.setOrder(order);
        bill.setCashier(cashier);

        // Calculate Subtotal from Order Items
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItem orderItem : order.getItems()) {
            subtotal = subtotal.add(orderItem.getLineTotal());
        }
        bill.setSubtotal(subtotal);

        // Calculate Discount
        DiscountType discType = request != null && request.getDiscountType() != null ? request.getDiscountType() : DiscountType.NONE;
        BigDecimal discVal = request != null && request.getDiscountValue() != null ? request.getDiscountValue() : BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (discType == DiscountType.PERCENTAGE) {
            if (discVal.compareTo(new BigDecimal("100")) > 0) {
                throw new BadRequestException("Discount percentage cannot exceed 100%");
            }
            discountAmount = subtotal.multiply(discVal).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        } else if (discType == DiscountType.FIXED) {
            if (discVal.compareTo(subtotal) > 0) {
                discountAmount = subtotal; // Cap discount at subtotal
            } else {
                discountAmount = discVal.setScale(2, RoundingMode.HALF_UP);
            }
        }

        bill.setDiscountType(discType);
        bill.setDiscountValue(discVal);
        bill.setDiscountAmount(discountAmount);

        // Taxable Amount = Subtotal - Discount
        BigDecimal taxableAmount = subtotal.subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);
        if (taxableAmount.compareTo(BigDecimal.ZERO) < 0) {
            taxableAmount = BigDecimal.ZERO;
        }
        bill.setTaxableAmount(taxableAmount);

        // Tax Components (CGST 2.5% + SGST 2.5% = 5% GST total)
        BigDecimal halfRate = defaultTaxRate.divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);
        BigDecimal cgstAmount = taxableAmount.multiply(halfRate).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal sgstAmount = taxableAmount.multiply(halfRate).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal totalTax = cgstAmount.add(sgstAmount);

        bill.setCgstRate(halfRate);
        bill.setCgstAmount(cgstAmount);
        bill.setSgstRate(halfRate);
        bill.setSgstAmount(sgstAmount);
        bill.setTotalTax(totalTax);

        // Grand Total = Taxable Amount + Total Tax
        BigDecimal grandTotal = taxableAmount.add(totalTax).setScale(2, RoundingMode.HALF_UP);
        bill.setGrandTotal(grandTotal);
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setBalanceAmount(grandTotal);
        bill.setPaymentStatus(PaymentStatus.UNPAID);

        // Create immutable snapshot of bill items
        for (OrderItem orderItem : order.getItems()) {
            BillItem billItem = new BillItem(
                    orderItem.getMenuItem().getId(),
                    orderItem.getItemName(),
                    orderItem.getUnitPrice(),
                    orderItem.getQuantity(),
                    orderItem.getLineTotal(),
                    defaultTaxRate
            );
            bill.addBillItem(billItem);
        }

        Bill saved = billRepository.save(bill);
        return new BillResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getAllBills() {
        return billRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BillResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BillResponse getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        return new BillResponse(bill);
    }

    @Transactional(readOnly = true)
    public BillResponse getBillByOrder(Long orderId) {
        Bill bill = billRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found for Order id: " + orderId));
        return new BillResponse(bill);
    }

    @Transactional(readOnly = true)
    public Bill getBillEntity(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
    }
}
