package com.restaurant.restaurant_api;

import com.restaurant.restaurant_api.Model.Customer;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class CustomerTest {

    @Test
    public void testCustomerConstructorAndGetters() {
        System.out.println("TEST: Customer constructor ve getter metodları test ediliyor.");

        Customer customer = new Customer("Ahmet", "ahmet@example.com", "password123");

        assertEquals("Ahmet", customer.getCustomerName());
        assertEquals("ahmet@example.com", customer.getCustomerEmail());
        assertEquals("password123", customer.getCustomerPassword());

        System.out.println("SONUÇ: testCustomerConstructorAndGetters PASSED");
    }

    @Test
    public void testCustomerSetters() {
        System.out.println("TEST: Customer setter metodları test ediliyor.");

        Customer customer = new Customer();
        customer.setCustomerName("Mehmet");
        customer.setCustomerEmail("mehmet@example.com");
        customer.setCustomerPassword("abc123");

        assertEquals("Mehmet", customer.getCustomerName());
        assertEquals("mehmet@example.com", customer.getCustomerEmail());
        assertEquals("abc123", customer.getCustomerPassword());

        System.out.println("SONUÇ: testCustomerSetters PASSED");
    }

    @Test
    public void testDefaultConstructor() {
        System.out.println("TEST: Customer default constructor test ediliyor.");

        Customer customer = new Customer();

        assertNotNull(customer);
        System.out.println("SONUÇ: testDefaultConstructor PASSED");
    }
}