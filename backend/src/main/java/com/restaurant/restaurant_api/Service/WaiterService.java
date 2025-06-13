package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.Waiter;
import com.restaurant.restaurant_api.Repository.WaiterRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class WaiterService {

    private final WaiterRepository waiterRepository;
    private final Validation validation;

    public WaiterService(WaiterRepository waiterRepository, Validation validation) {
        this.waiterRepository = waiterRepository;
        this.validation = validation;
    }

    public List<Waiter> getAllWaiters() {
        return getWaiterRepository().findAll();
    }

    public List<Waiter> getWaiterById(int employeeId) {
        if (getValidation().isIdValid(employeeId)) {
            return getWaiterRepository().findById(employeeId)
                .map(waiter -> List.of(waiter))
                .orElseThrow(() -> new NoSuchElementException("waiter is not found"));
        }
        throw new IllegalArgumentException("employeeId cannot be equal or lower than 0");
    }

    public Waiter postWaiter(Waiter waiter) {
        return getWaiterRepository().save(waiter);
    }

    public void deleteWaiterById(int employeeId) {
        if (getValidation().isIdValid(employeeId)) {
            if (getWaiterRepository().existsById(employeeId)) {
                getWaiterRepository().deleteById(employeeId);
            }
            return;
        }
        throw new IllegalArgumentException("employeeId cannot be equal or lower than 0");
    }

    public Waiter putByEmployeeId(int employeeId, Waiter waiter) {
        if (getValidation().isIdValid(employeeId)) {
            return getWaiterRepository().findById(employeeId)
                .map(oldWaiter -> {
                    oldWaiter.setWaiterTables(waiter.getWaiterTables());
                    oldWaiter.setEmployeeName(waiter.getEmployeeName());
                    oldWaiter.setEmployeeSalary(waiter.getEmployeeSalary());
                    return getWaiterRepository().save(oldWaiter);
                })
                .orElseThrow(() -> new NoSuchElementException("waiter is not found"));
        }
        throw new IllegalArgumentException("employeeId cannot be equal or lower than 0");
    }

    public WaiterRepository getWaiterRepository() {
        return waiterRepository;
    }

    public Validation getValidation() {
        return validation;
    }
}
