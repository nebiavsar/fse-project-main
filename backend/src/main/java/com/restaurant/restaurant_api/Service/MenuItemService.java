package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.MenuItem;
import com.restaurant.restaurant_api.Model.Order;
import com.restaurant.restaurant_api.Repository.MenuItemRepository;
import com.restaurant.restaurant_api.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findByIsActiveTrue();
    }

    public MenuItem getMenuItemById(int id) {
        MenuItem menuItem = menuItemRepository.findById(id);
        if (menuItem == null || !menuItem.isActive()) {
            throw new RuntimeException("Menu item not found");
        }
        return menuItem;
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        if (menuItem.getMenuItemStock() < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }
        menuItem.setActive(true);
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(MenuItem menuItem) {
        if (!menuItemRepository.existsById(menuItem.getMenuItemId())) {
            throw new RuntimeException("Menu item not found");
        }
        if (menuItem.getMenuItemStock() < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }
        MenuItem existingItem = menuItemRepository.findById(menuItem.getMenuItemId());
        menuItem.setActive(existingItem.isActive());
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(int id) {
        MenuItem menuItem = menuItemRepository.findById(id);
        if (menuItem == null) {
            throw new RuntimeException("Menu item not found");
        }
        try {
            menuItem.setActive(false);
            menuItemRepository.save(menuItem);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete menu item: " + e.getMessage());
        }
    }

    public List<MenuItem> getMenuItemByCategory(String category) {
        return menuItemRepository.findByMenuItemCategory(category).stream()
                .filter(MenuItem::isActive)
                .toList();
    }

    public MenuItem updateStock(int id, int quantity) {
        MenuItem menuItem = getMenuItemById(id);
        int newStock = menuItem.getMenuItemStock() + quantity;
        if (newStock < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }
        menuItem.setMenuItemStock(newStock);
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> getLowStockItems(int threshold) {
        return menuItemRepository.findAll().stream()
                .filter(item -> item.getMenuItemStock() <= threshold)
                .toList();
    }
}
