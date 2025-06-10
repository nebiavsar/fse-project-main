package com.restaurant.restaurant_api;

import org.springframework.stereotype.Component;

@Component
public class Validation {

    public boolean isIdValid(int id) {
        return id>0;
    }

}
