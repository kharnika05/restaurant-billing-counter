package com.restaurant.billing.service;

import com.restaurant.billing.dto.CategoryDto;
import com.restaurant.billing.dto.CreateMenuItemRequest;
import com.restaurant.billing.dto.MenuItemDto;
import com.restaurant.billing.entity.MenuCategory;
import com.restaurant.billing.entity.MenuItem;
import com.restaurant.billing.exception.BadRequestException;
import com.restaurant.billing.exception.ResourceNotFoundException;
import com.restaurant.billing.repository.MenuCategoryRepository;
import com.restaurant.billing.repository.MenuItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    public MenuService(MenuItemRepository menuItemRepository, MenuCategoryRepository menuCategoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.menuCategoryRepository = menuCategoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return menuCategoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(CategoryDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (menuCategoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists.");
        }
        MenuCategory category = new MenuCategory(dto.getName(), dto.getDescription(), dto.getDisplayOrder());
        return new CategoryDto(menuCategoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        MenuCategory category = menuCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setDisplayOrder(dto.getDisplayOrder());
        return new CategoryDto(menuCategoryRepository.save(category));
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuItems(Long categoryId, Boolean isVeg, String search) {
        return menuItemRepository.searchMenuItems(categoryId, isVeg, search).stream()
                .map(MenuItemDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> getPublicAvailableMenu() {
        return menuItemRepository.findByIsAvailableTrueAndIsArchivedFalse().stream()
                .map(MenuItemDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuItemDto getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return new MenuItemDto(item);
    }

    @Transactional
    public MenuItemDto createMenuItem(CreateMenuItemRequest request) {
        MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        MenuItem item = new MenuItem(
                category,
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.isVeg(),
                request.getImageUrl()
        );
        item.setAvailable(request.isAvailable());
        return new MenuItemDto(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemDto updateMenuItem(Long id, CreateMenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        item.setCategory(category);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setVeg(request.isVeg());
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            item.setImageUrl(request.getImageUrl());
        }
        item.setAvailable(request.isAvailable());
        return new MenuItemDto(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemDto toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        item.setAvailable(!item.isAvailable());
        return new MenuItemDto(menuItemRepository.save(item));
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        // Soft delete / archive to protect historical billing referential integrity
        item.setArchived(true);
        item.setAvailable(false);
        menuItemRepository.save(item);
    }
}
