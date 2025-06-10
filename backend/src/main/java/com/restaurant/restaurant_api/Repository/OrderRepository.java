package com.restaurant.restaurant_api.Repository;

import com.restaurant.restaurant_api.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByOrderTableTableId(int orderTableId);

    Order findById(int orderId);

    boolean existsByOrderTableTableId(int orderTableId);

    void deleteByOrderTableTableId(int orderTableId);
}
