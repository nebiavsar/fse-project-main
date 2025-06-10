package com.restaurant.restaurant_api.Repository;

import com.restaurant.restaurant_api.Model.Card;
import com.restaurant.restaurant_api.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Integer> {

    Card findById(int cardId);

    List<Card> findByCardCustomer(Customer cardCustomer);

    List<Card> findByCardCustomerCustomerId(int customerId);

    void deleteByCardCustomerCustomerId(int cardCustomerId);

    boolean existsByCardCustomerCustomerId(int customerId);
}
