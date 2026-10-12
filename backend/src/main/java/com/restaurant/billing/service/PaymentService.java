package com.restaurant.billing.service;

import com.restaurant.billing.dto.PaymentResponse;
import com.restaurant.billing.dto.RecordPaymentRequest;
import com.restaurant.billing.dto.RefundRequest;
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
public class PaymentService {

    private final BillRepository billRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final RestaurantTableRepository tableRepository;
    private final CustomerRepository customerRepository;
    private final AuthService authService;

    public PaymentService(BillRepository billRepository,
                          PaymentRepository paymentRepository,
                          RefundRepository refundRepository,
                          OrderRepository orderRepository,
                          RestaurantTableRepository tableRepository,
                          CustomerRepository customerRepository,
                          AuthService authService) {
        this.billRepository = billRepository;
        this.paymentRepository = paymentRepository;
        this.refundRepository = refundRepository;
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
        this.customerRepository = customerRepository;
        this.authService = authService;
    }

    @Transactional
    public PaymentResponse recordPayment(Long billId, RecordPaymentRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + billId));

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("This bill is already fully paid.");
        }

        BigDecimal payAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
        BigDecimal currentBalance = bill.getBalanceAmount();

        if (payAmount.compareTo(currentBalance) > 0) {
            throw new BadRequestException("Payment amount (" + payAmount + ") exceeds outstanding balance (" + currentBalance + ").");
        }

        User cashier = authService.getCurrentUser();
        String paymentNumber = "PAY-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Payment payment = new Payment(
                bill,
                paymentNumber,
                payAmount,
                request.getPaymentMethod(),
                request.getTransactionReference(),
                cashier
        );
        Payment savedPayment = paymentRepository.save(payment);

        // Update Bill balances
        BigDecimal newPaidAmount = bill.getPaidAmount().add(payAmount);
        BigDecimal newBalance = bill.getGrandTotal().subtract(newPaidAmount).setScale(2, RoundingMode.HALF_UP);

        bill.setPaidAmount(newPaidAmount);
        bill.setBalanceAmount(newBalance);

        if (newBalance.compareTo(BigDecimal.ZERO) <= 0) {
            bill.setPaymentStatus(PaymentStatus.PAID);

            // Complete Order & Free Table
            Order order = bill.getOrder();
            if (order != null) {
                order.setStatus(OrderStatus.COMPLETED);
                orderRepository.save(order);

                if (order.getTable() != null) {
                    order.getTable().setStatus(TableStatus.AVAILABLE);
                    tableRepository.save(order.getTable());
                }

                // Update Customer Lifetime Stats
                if (order.getCustomer() != null) {
                    Customer customer = order.getCustomer();
                    customer.setTotalVisits(customer.getTotalVisits() + 1);
                    customer.setTotalSpent(customer.getTotalSpent().add(bill.getGrandTotal()));
                    customerRepository.save(customer);
                }
            }
        } else {
            bill.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        }

        billRepository.save(bill);
        return new PaymentResponse(savedPayment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsForBill(Long billId) {
        return paymentRepository.findByBillId(billId).stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void processRefund(Long paymentId, RefundRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        BigDecimal refundAmt = request.getAmount().setScale(2, RoundingMode.HALF_UP);
        if (refundAmt.compareTo(payment.getAmount()) > 0) {
            throw new BadRequestException("Refund amount cannot exceed the original payment amount of " + payment.getAmount());
        }

        User user = authService.getCurrentUser();
        Refund refund = new Refund(payment.getBill(), payment, refundAmt, request.getReason(), user);
        refundRepository.save(refund);

        Bill bill = payment.getBill();
        bill.setPaidAmount(bill.getPaidAmount().subtract(refundAmt));
        bill.setBalanceAmount(bill.getGrandTotal().subtract(bill.getPaidAmount()));
        bill.setPaymentStatus(PaymentStatus.REFUNDED);
        billRepository.save(bill);

        payment.setStatus("REFUNDED");
        paymentRepository.save(payment);
    }
}
