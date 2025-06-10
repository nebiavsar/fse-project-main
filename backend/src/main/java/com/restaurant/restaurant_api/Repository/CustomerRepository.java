package com.restaurant.restaurant_api.Repository;

import com.restaurant.restaurant_api.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Customer findCustomerByCustomerEmail(String customerEmail);

    Customer findById(int customerId);

}
