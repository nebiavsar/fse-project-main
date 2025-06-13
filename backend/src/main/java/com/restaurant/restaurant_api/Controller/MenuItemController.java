package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.MenuItem;
import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable int id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.createMenuItem(menuItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable int id, @RequestBody MenuItem menuItem) {
        menuItem.setMenuItemId(id);
        return ResponseEntity.ok(menuItemService.updateMenuItem(menuItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable int id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
        }
    }

    @GetMapping("/filter/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemByCategory(@PathVariable String category) {
        return new ResponseEntity<>(menuItemService.getMenuItemByCategory(category), HttpStatus.OK);
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<MenuItem> updateStock(@PathVariable int id, @RequestParam int quantity) {
        try {
            return ResponseEntity.ok(menuItemService.updateStock(id, quantity));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(null);
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<MenuItem>> getLowStockItems(@RequestParam(defaultValue = "5") int threshold) {
        return ResponseEntity.ok(menuItemService.getLowStockItems(threshold));
    }

    public MenuItemService getMenuItemService() {
        return menuItemService;
    }
}
