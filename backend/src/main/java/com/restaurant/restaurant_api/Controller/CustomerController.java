package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.Customer;
import com.restaurant.restaurant_api.Service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Customers")
public class CustomerController {

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
    public ResponseEntity<Customer> postACustomer(@RequestBody Customer customer) {
        if (customer != null) {
            return new ResponseEntity<>(getCustomerService().postCustomer(customer), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new Customer(), HttpStatus.BAD_REQUEST);
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
