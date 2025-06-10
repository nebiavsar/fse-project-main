package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.MenuItem;
import com.restaurant.restaurant_api.Model.Order;
import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Repository.CardRepository;
import com.restaurant.restaurant_api.Repository.MenuItemRepository;
import com.restaurant.restaurant_api.Repository.OrderRepository;
import com.restaurant.restaurant_api.Repository.TableRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;
    private final CardRepository cardRepository;
    private final Validation validation;

    public OrderService(OrderRepository orderRepository,
                        TableRepository tableRepository,
                        MenuItemRepository menuItemRepository,
                        CardRepository cardRepository,
                        Validation validation) {
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
        this.menuItemRepository = menuItemRepository;
        this.cardRepository = cardRepository;
        this.validation = validation;
    }

    public List<Order> getAllOrders() {
        return getOrderRepository().findAll();
    }

    public List<Order> getOrderByTableId(int orderTableId) {
        if (getValidation().isIdValid(orderTableId)) {
            return getOrderRepository().findByOrderTableTableId(orderTableId);
        }
        throw new IllegalArgumentException("orderTableId cannot be equal or lower than 0");
    }

    public List<Order> getOrderById(int orderId) {
        if (getValidation().isIdValid(orderId)) {
            Order order = getOrderRepository().findById(orderId);
            if (order == null) throw new NoSuchElementException("order is not found");
            return List.of(order);
        }
        throw new IllegalArgumentException("orderId cannot be equal or lower than 0");
    }

    public Order postOrder(Order order) {
        System.out.println("Gelen sipariş verisi: " + order);
        
        if (order.getOrderTable() != null) {
            System.out.println("Masa ID: " + order.getOrderTable().getTableId());
            
            if (getTableRepository().existsById(order.getOrderTable().getTableId())) {
                // Masa bilgisini veritabanından al
                Table table = getTableRepository().findById(order.getOrderTable().getTableId());
                System.out.println("Veritabanından alınan masa: " + table);
                order.setOrderTable(table);

                // Kart kontrolü
                if (order.getOrderCard() != null) {
                    System.out.println("Kart ID: " + order.getOrderCard().getCardId());
                    if (!getCardRepository().existsById(order.getOrderCard().getCardId())) {
                        throw new NoSuchElementException("card not found");
                    }
                }

                // Menü öğelerini kontrol et ve veritabanından al
                List<MenuItem> menuItems = new ArrayList<>();
                System.out.println("Menü öğeleri: " + order.getOrderMenuItems());
                
                for (MenuItem menuItem : order.getOrderMenuItems()) {
                    System.out.println("İşlenen menü öğesi ID: " + menuItem.getMenuItemId());
                    MenuItem dbMenuItem = getMenuItemRepository().findById(menuItem.getMenuItemId());
                    if (dbMenuItem == null) {
                        throw new NoSuchElementException("menuItem is not found: " + menuItem.getMenuItemId());
                    }
                    System.out.println("Veritabanından alınan menü öğesi: " + dbMenuItem);
                    menuItems.add(dbMenuItem);
                }
                order.setOrderMenuItems(menuItems);

                System.out.println("Kaydedilecek sipariş: " + order);
                Order savedOrder = getOrderRepository().save(order);
                System.out.println("Kaydedilen sipariş: " + savedOrder);
                return savedOrder;
            }
            throw new NoSuchElementException("table not found");
        }
        throw new IllegalArgumentException("orderTable cannot be null");
    }

    public void deleteOrderById(int orderId) {
        if (getValidation().isIdValid(orderId)) {
            if (getOrderRepository().existsById(orderId)) {
                getOrderRepository().deleteById(orderId);
                return;
            }
            throw new NoSuchElementException("order is not found");
        }
        throw new IllegalArgumentException("orderId cannot be equal or lower than 0");
    }

    public void deleteByOrderTableId(int orderTableId) {
        if (getValidation().isIdValid(orderTableId)) {
            if (getOrderRepository().existsByOrderTableTableId(orderTableId)) {
                getOrderRepository().deleteByOrderTableTableId(orderTableId);
                return;
            }
        }
        throw new IllegalArgumentException("orderTableId cannot be equal or lower than 0");
    }

    public Order putByOrderId(int orderId, Order order) {
        if (getValidation().isIdValid(orderId)) {
            Order oldOrder = getOrderRepository().findById(orderId);
            if (oldOrder != null) {
                if (order.getOrderTable() != null) {
                    if (getTableRepository().existsById(order.getOrderTable().getTableId())) {
                        if (order.getOrderCard() != null && !getCardRepository().existsById(order.getOrderCard().getCardId())) {
                            throw new NoSuchElementException("card not found");
                        }
                        for (MenuItem menuItem : order.getOrderMenuItems()) {
                            if (!getMenuItemRepository().existsById(menuItem.getMenuItemId())) {
                                throw new NoSuchElementException("menuItem is not found");
                            }
                        }
                        oldOrder.setOrderCard(order.getOrderCard());
                        oldOrder.setOrderPrice(order.getOrderPrice());
                        oldOrder.setOrderStatue(order.getOrderStatue());
                        oldOrder.setOrderTable(order.getOrderTable());
                        oldOrder.setOrderMenuItems(order.getOrderMenuItems());
                        return getOrderRepository().save(oldOrder);
                    }
                    throw new NoSuchElementException("table not found");
                }
                throw new IllegalArgumentException("orderTable cannot be null");
            }
            throw new NoSuchElementException("order is not found");
        }
        throw new IllegalArgumentException("orderId cannot be equal or lower than 0");
    }

    public OrderRepository getOrderRepository() {
        return orderRepository;
    }

    public TableRepository getTableRepository() {
        return tableRepository;
    }

    public MenuItemRepository getMenuItemRepository() {
        return menuItemRepository;
    }

    public CardRepository getCardRepository() {
        return cardRepository;
    }

    public Validation getValidation() {
        return validation;
    }
}
