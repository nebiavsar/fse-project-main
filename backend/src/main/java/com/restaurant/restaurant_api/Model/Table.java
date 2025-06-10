package com.restaurant.restaurant_api.Model;


import jakarta.persistence.*;

@Entity
@jakarta.persistence.Table(name = "TABLES")
public class Table {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_id", nullable = false)
    private int tableId;
    @Column(name = "total_cost", nullable = false)
    private int tableTotalCost;
    @Column(name = "is_table_available", nullable = false)
    private boolean isTableAvailable = true;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "waiter_id")
    private Waiter tableWaiter;

    public Table() {}

    public Table(int tableId, int tableTotalCost, boolean isTableAvailable, Waiter tableWaiter) {
        this.tableId = tableId;
        this.tableTotalCost = tableTotalCost;
        this.isTableAvailable = isTableAvailable;
        this.tableWaiter = tableWaiter;
    }

    public Table(int tableTotalCost, boolean isTableAvailable, Waiter tableWaiter) {
        this.tableTotalCost = tableTotalCost;
        this.isTableAvailable = isTableAvailable;
        this.tableWaiter = tableWaiter;
    }

    public int getTableId() {
        return tableId;
    }

    public int getTableTotalCost() {
        return tableTotalCost;
    }

    public boolean isTableAvailable() {
        return isTableAvailable;
    }

    public Waiter getTableWaiter() {
        return tableWaiter;
    }

    public void setTableTotalCost(int tableTotalCost) {
        this.tableTotalCost = tableTotalCost;
    }

    public void setTableAvailable(boolean tableAvailable) {
        isTableAvailable = tableAvailable;
    }

    public void setTableWaiter(Waiter tableWaiter) {
        this.tableWaiter = tableWaiter;
    }
}
