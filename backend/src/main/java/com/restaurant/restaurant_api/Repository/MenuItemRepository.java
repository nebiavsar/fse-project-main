package com.restaurant.restaurant_api.Repository;

import com.restaurant.restaurant_api.Model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {
    MenuItem findByMenuItemName(String menuItemName);

    MenuItem findById(int menuItemId);

    List<MenuItem> findByMenuItemCategory(String category);

    List<MenuItem> findByIsActiveTrue();
}

