package com.restaurant.restaurant_api.Model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ORDERS")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false)
    private int orderId;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "table_id", nullable = false)
    private com.restaurant.restaurant_api.Model.Table orderTable;

    @Column(name = "order_price", nullable = false)
    private int orderPrice;

    @Column(name = "order_statue", nullable = false)
    private short orderStatue;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "card_id")
    private Card orderCard;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
            name = "ORDER_MENU_ITEM",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "menu_item_id")
    )
    private List<MenuItem> orderMenuItems = new ArrayList<>();

    public Order() {}

    public Order(int orderId, com.restaurant.restaurant_api.Model.Table orderTable, int orderPrice, short orderStatue, Card orderCard, List<MenuItem> orderMenuItems) {
        this.orderId = orderId;
        this.orderTable = orderTable;
        this.orderPrice = orderPrice;
        this.orderStatue = orderStatue;
        this.orderCard = orderCard;
        this.orderMenuItems = orderMenuItems;
    }

    public Order(com.restaurant.restaurant_api.Model.Table orderTable, int orderPrice, short orderStatue, Card orderCard, List<MenuItem> orderMenuItems) {
        this.orderTable = orderTable;
        this.orderPrice = orderPrice;
        this.orderStatue = orderStatue;
        this.orderCard = orderCard;
        this.orderMenuItems = orderMenuItems;
    }

    public int getOrderId() {
        return orderId;
    }

    public com.restaurant.restaurant_api.Model.Table getOrderTable() {
        return orderTable;
    }

    public int getOrderPrice() {
        return orderPrice;
    }

    public short getOrderStatue() {
        return orderStatue;
    }

    public Card getOrderCard() {
        return orderCard;
    }

    public List<MenuItem> getOrderMenuItems() {
        return orderMenuItems;
    }

    public void setOrderTable(com.restaurant.restaurant_api.Model.Table orderTable) {
        this.orderTable = orderTable;
    }

    public void setOrderPrice(int orderPrice) {
        this.orderPrice = orderPrice;
    }

    public void setOrderStatue(short orderStatue) {
        this.orderStatue = orderStatue;
    }

    public void setOrderCard(Card orderCard) {
        this.orderCard = orderCard;
    }

    public void setOrderMenuItems(List<MenuItem> orderMenuItems) {
        this.orderMenuItems = orderMenuItems;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", orderTable=" + (orderTable != null ? orderTable.getTableId() : "null") +
                ", orderPrice=" + orderPrice +
                ", orderStatue=" + orderStatue +
                ", orderCard=" + (orderCard != null ? orderCard.getCardId() : "null") +
                ", orderMenuItems=" + orderMenuItems +
                '}';
    }
}
