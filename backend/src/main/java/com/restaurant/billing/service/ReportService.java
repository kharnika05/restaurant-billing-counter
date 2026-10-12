package com.restaurant.billing.service;

import com.restaurant.billing.dto.*;
import com.restaurant.billing.entity.OrderStatus;
import com.restaurant.billing.entity.PaymentMethod;
import com.restaurant.billing.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final BillItemRepository billItemRepository;
    private final PaymentRepository paymentRepository;
    private final IngredientRepository ingredientRepository;

    public ReportService(BillRepository billRepository,
                         OrderRepository orderRepository,
                         BillItemRepository billItemRepository,
                         PaymentRepository paymentRepository,
                         IngredientRepository ingredientRepository) {
        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.billItemRepository = billItemRepository;
        this.paymentRepository = paymentRepository;
        this.ingredientRepository = ingredientRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary() {
        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setTodaySales(billRepository.sumTotalSalesBetween(startOfToday, endOfToday));
        dto.setTodayOrderCount(orderRepository.countOrdersBetween(startOfToday, endOfToday));
        dto.setTotalBillsGenerated(billRepository.countBillsBetween(startOfToday, endOfToday));
        dto.setAverageOrderValue(billRepository.avgBillAmountBetween(startOfToday, endOfToday));

        List<OrderStatus> pendingStatuses = List.of(OrderStatus.CREATED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY);
        dto.setPendingOrders(orderRepository.findByStatusInOrderByCreatedAtAsc(pendingStatuses).size());
        dto.setLowStockCount(ingredientRepository.findLowStockIngredients().size());

        // Top Selling Items
        dto.setTopSellingItems(getTopSellingItems(5));

        // Recent Orders
        dto.setRecentOrders(orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(6)
                .map(OrderResponse::new)
                .collect(Collectors.toList()));

        // Payment Method breakdown
        dto.setPaymentMethods(getPaymentMethodSummary(startOfToday, endOfToday));

        return dto;
    }

    @Transactional(readOnly = true)
    public List<TopSellingItemDto> getTopSellingItems(int limit) {
        List<Object[]> raw = billItemRepository.findTopSellingItems();
        List<TopSellingItemDto> list = new ArrayList<>();
        int count = 0;
        for (Object[] row : raw) {
            if (count++ >= limit) break;
            String name = (String) row[0];
            Number qty = (Number) row[1];
            BigDecimal rev = (BigDecimal) row[2];
            list.add(new TopSellingItemDto(name, qty != null ? qty.longValue() : 0L, rev != null ? rev : BigDecimal.ZERO));
        }
        return list;
    }

    @Transactional(readOnly = true)
    public List<PaymentMethodReportDto> getPaymentMethodSummary(LocalDateTime start, LocalDateTime end) {
        List<Object[]> raw = paymentRepository.getPaymentMethodSummary(start, end);
        List<PaymentMethodReportDto> list = new ArrayList<>();
        for (Object[] row : raw) {
            PaymentMethod method = (PaymentMethod) row[0];
            Number count = (Number) row[1];
            BigDecimal total = (BigDecimal) row[2];
            list.add(new PaymentMethodReportDto(method, count != null ? count.longValue() : 0L, total != null ? total : BigDecimal.ZERO));
        }
        return list;
    }

    @Transactional(readOnly = true)
    public List<SalesReportDto> getDailySalesReport(int days) {
        List<SalesReportDto> list = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime start = LocalDateTime.of(date, LocalTime.MIN);
            LocalDateTime end = LocalDateTime.of(date, LocalTime.MAX);

            BigDecimal sales = billRepository.sumTotalSalesBetween(start, end);
            long orders = orderRepository.countOrdersBetween(start, end);

            // Simple tax snapshot calculation
            BigDecimal tax = sales.multiply(new BigDecimal("0.05")).divide(new BigDecimal("1.05"), 2, java.math.RoundingMode.HALF_UP);
            BigDecimal net = sales.subtract(tax);

            list.add(new SalesReportDto(
                    date.format(DateTimeFormatter.ofPattern("dd MMM")),
                    sales,
                    BigDecimal.ZERO,
                    tax,
                    net,
                    orders
            ));
        }
        return list;
    }

    @Transactional(readOnly = true)
    public String generateSalesReportCsv(int days) {
        List<SalesReportDto> reports = getDailySalesReport(days);
        StringBuilder sb = new StringBuilder();
        sb.append("Date,Gross Sales,Discounts,Tax Collected,Net Sales,Order Count\n");
        for (SalesReportDto r : reports) {
            sb.append(String.format("%s,%.2f,%.2f,%.2f,%.2f,%d\n",
                    r.getDateLabel(),
                    r.getGrossSales(),
                    r.getDiscountAmount(),
                    r.getTaxAmount(),
                    r.getNetSales(),
                    r.getOrderCount()));
        }
        return sb.toString();
    }
}
