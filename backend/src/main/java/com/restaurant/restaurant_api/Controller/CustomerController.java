package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.Customer;
import com.restaurant.restaurant_api.Service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/Customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {
    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getCustomers(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String customerEmail
    ) {
        if (customerId == null && customerEmail == null) {
            return new ResponseEntity<>(getCustomerService().getAllCustomers(), HttpStatus.OK);
        }
        else if (customerId == null) {
            return new ResponseEntity<>(getCustomerService().getCustomerByEmail(customerEmail), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(getCustomerService().getCustomerById(customerId), HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<?> postACustomer(@RequestBody Customer customer) {
        try {
            logger.info("Received request to create new customer");
            if (customer == null) {
                logger.error("Customer object is null");
                return new ResponseEntity<>("Customer object cannot be null", HttpStatus.BAD_REQUEST);
            }
            
            Customer savedCustomer = getCustomerService().postCustomer(customer);
            logger.info("Successfully created customer with ID: {}", savedCustomer.getCustomerId());
            return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteACustomer(@PathVariable int customerId) {
        getCustomerService().deleteCustomerById(customerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public CustomerService getCustomerService() {
        return customerService;
    }
}
