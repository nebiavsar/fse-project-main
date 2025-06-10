package com.restaurant.restaurant_api.Model;


import jakarta.persistence.*;
import jakarta.persistence.Table;

@Entity
@Table(name = "CARD")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id", nullable = false)
    private int cardId;
    @Column(name = "card_no", nullable = false)
    private String cardNo;
    @Column(name = "card_cvv", nullable = false)
    private String cardCvv;
    @Column(name = "card_date",nullable = false)
    private String cardDate;
    @JoinColumn(name = "customer_id", nullable = false)
    @ManyToOne(cascade = CascadeType.MERGE)
    private Customer cardCustomer;

    public Card() {}

    public Card(String cardNo, String cardCvv, String cardDate, Customer cardCustomer) {
        this.cardNo = cardNo;
        this.cardCvv = cardCvv;
        this.cardDate = cardDate;
        this.cardCustomer = cardCustomer;
    }

    public int getCardId() {
        return cardId;
    }

    public String getCardNo() {
        return cardNo;
    }

    public String getCardCvv() {
        return cardCvv;
    }

    public String getCardDate() {
        return cardDate;
    }

    public Customer getCardCustomer() {
        return cardCustomer;
    }

    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    public void setCardCvv(String cardCvv) {
        this.cardCvv = cardCvv;
    }

    public void setCardDate(String cardDate) {
        this.cardDate = cardDate;
    }

    public void setCardCustomer(Customer cardCustomer) {
        this.cardCustomer = cardCustomer;
    }
}
