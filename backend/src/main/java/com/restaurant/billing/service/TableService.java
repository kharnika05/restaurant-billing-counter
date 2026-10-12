package com.restaurant.billing.service;

import com.restaurant.billing.dto.CreateTableRequest;
import com.restaurant.billing.dto.TableDto;
import com.restaurant.billing.dto.UpdateTableStatusRequest;
import com.restaurant.billing.entity.RestaurantTable;
import com.restaurant.billing.entity.TableStatus;
import com.restaurant.billing.exception.BadRequestException;
import com.restaurant.billing.exception.ResourceNotFoundException;
import com.restaurant.billing.repository.OrderRepository;
import com.restaurant.billing.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableService {

    private final RestaurantTableRepository tableRepository;
    private final OrderRepository orderRepository;

    public TableService(RestaurantTableRepository tableRepository, OrderRepository orderRepository) {
        this.tableRepository = tableRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<TableDto> getAllTables() {
        return tableRepository.findAllByOrderByTableNumberAsc().stream()
                .map(TableDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public TableDto createTable(CreateTableRequest request) {
        if (tableRepository.findByTableNumber(request.getTableNumber()).isPresent()) {
            throw new BadRequestException("Table with number '" + request.getTableNumber() + "' already exists.");
        }
        RestaurantTable table = new RestaurantTable(
                request.getTableNumber(),
                request.getSeatingCapacity(),
                request.getSection(),
                request.getStatus()
        );
        return new TableDto(tableRepository.save(table));
    }

    @Transactional
    public TableDto updateTable(Long id, CreateTableRequest request) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        tableRepository.findByTableNumber(request.getTableNumber()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Another table with number '" + request.getTableNumber() + "' already exists.");
            }
        });

        table.setTableNumber(request.getTableNumber());
        table.setSeatingCapacity(request.getSeatingCapacity());
        table.setSection(request.getSection());
        table.setStatus(request.getStatus());
        return new TableDto(tableRepository.save(table));
    }

    @Transactional
    public TableDto updateTableStatus(Long id, UpdateTableStatusRequest request) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        if (request.getStatus() == TableStatus.AVAILABLE) {
            orderRepository.findActiveOrderByTableId(id).ifPresent(order -> {
                throw new BadRequestException("Cannot mark table as AVAILABLE while active order " + order.getOrderNumber() + " is pending.");
            });
        }

        table.setStatus(request.getStatus());
        return new TableDto(tableRepository.save(table));
    }
}
