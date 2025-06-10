package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.MenuItem;
import com.restaurant.restaurant_api.Repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem getMenuItemById(int id) {
        MenuItem menuItem = menuItemRepository.findById(id);
        if (menuItem == null) {
            throw new RuntimeException("Menu item not found");
        }
        return menuItem;
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(MenuItem menuItem) {
        if (!menuItemRepository.existsById(menuItem.getMenuItemId())) {
            throw new RuntimeException("Menu item not found");
        }
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(int id) {
        if (!menuItemRepository.existsById(id)) {
            throw new RuntimeException("Menu item not found");
        }
        menuItemRepository.deleteById(id);
    }

    public List<MenuItem> getMenuItemByCategory(String category) {
        return menuItemRepository.findByMenuItemCategory(category);
    }
}
