package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.Customer;
import com.restaurant.restaurant_api.Repository.CustomerRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CustomerService {
    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);
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
        try {
            logger.info("Attempting to create new customer with email: {}", customer.getCustomerEmail());
            
            if (customer == null) {
                logger.error("Customer object is null");
                throw new IllegalArgumentException("Customer object cannot be null");
            }

            if (customer.getCustomerName() == null || customer.getCustomerName().trim().isEmpty()) {
                logger.error("Customer name is empty");
                throw new IllegalArgumentException("Customer name cannot be empty");
            }

            if (customer.getCustomerEmail() == null || customer.getCustomerEmail().trim().isEmpty()) {
                logger.error("Customer email is empty");
                throw new IllegalArgumentException("Customer email cannot be empty");
            }

            if (!isEmailValid(customer.getCustomerEmail())) {
                logger.error("Invalid email format: {}", customer.getCustomerEmail());
                throw new IllegalArgumentException("Invalid email format");
            }

            if (customer.getCustomerPassword() == null || customer.getCustomerPassword().trim().isEmpty()) {
                logger.error("Customer password is empty");
                throw new IllegalArgumentException("Customer password cannot be empty");
            }

            Customer savedCustomer = getCustomerRepository().save(customer);
            logger.info("Successfully created customer with ID: {}", savedCustomer.getCustomerId());
            return savedCustomer;
        } catch (Exception e) {
            logger.error("Error creating customer: {}", e.getMessage(), e);
            throw e;
        }
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
