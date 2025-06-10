package com.restaurant.restaurant_api.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "WAITER")
public class Waiter extends Employee {

    @Column(name = "waiter_tables")
    private int waiterTables;

    public Waiter() {}

    public Waiter(String employeeName, int employeeSalary, int waiterTables) {
        super(employeeName, employeeSalary);
        this.waiterTables = waiterTables;
    }

    public int getWaiterTables() {
        return waiterTables;
    }

    public void setWaiterTables(int waiterTables) {
        this.waiterTables = waiterTables;
    }
}
