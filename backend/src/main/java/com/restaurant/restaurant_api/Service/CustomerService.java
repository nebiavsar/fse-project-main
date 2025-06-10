package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.Customer;
import com.restaurant.restaurant_api.Repository.CustomerRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final Validation validation;

    public CustomerService(CustomerRepository customerRepository, Validation validation) {
        this.customerRepository = customerRepository;
        this.validation = validation;
    }

    public List<Customer> getAllCustomers() {
        return getCustomerRepository().findAll();
    }

    public List<Customer> getCustomerByEmail(String customerEmail) {
        if (isEmailValid(customerEmail)) {
            Customer customer = getCustomerRepository().findCustomerByCustomerEmail(customerEmail);
            if (customer == null) throw new NoSuchElementException("customer not found");
            return List.of(customer);
        }
        throw new IllegalArgumentException("email is not valid");
    }

    private boolean isEmailValid(String customerEmail) {
        return customerEmail.matches(
                "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
                        + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
        );
    }

    public List<Customer> getCustomerById(int customerId) {
        if (getValidation().isIdValid(customerId)) {
            Customer customer = getCustomerRepository().findById(customerId);
            if (customer == null) throw new NoSuchElementException("customer not found");
            return List.of(customer);
        }
        throw new IllegalArgumentException("customerId cannot be equal or lower than 0");
    }

    public Customer postCustomer(Customer customer) {
        if (isEmailValid(customer.getCustomerEmail())) {
            return getCustomerRepository().save(customer);
        }
        throw new IllegalArgumentException("customer object not accepted");
    }

    public void deleteCustomerById(int customerId) {
        if (getValidation().isIdValid(customerId)) {
            if (getCustomerRepository().existsById(customerId)) {
                getCustomerRepository().deleteById(customerId);
                return;
            }
            throw new NoSuchElementException("customer not found");
        }
        throw new IllegalArgumentException("customerId cannot be equal or lower than 0");
    }

    public CustomerRepository getCustomerRepository() {
        return customerRepository;
    }

    public Validation getValidation() {
        return validation;
    }
}
