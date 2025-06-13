package com.restaurant.restaurant_api.Repository;

import com.restaurant.restaurant_api.Model.Waiter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WaiterRepository extends JpaRepository<Waiter, Integer> {
    // JpaRepository already provides findById method
}
