package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.Card;
import com.restaurant.restaurant_api.Repository.CardRepository;
import com.restaurant.restaurant_api.Repository.CustomerRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final CustomerRepository customerRepository;
    private final Validation validation;

    public CardService(CardRepository cardRepository, CustomerRepository customerRepository, Validation validation) {
        this.cardRepository = cardRepository;
        this.customerRepository = customerRepository;
        this.validation = validation;
    }

    public List<Card> getAllCardsForCustomer(int cardCustomerId) {
        if (getValidation().isIdValid(cardCustomerId)) {
            return getCardRepository().findByCardCustomerCustomerId(cardCustomerId);
        }
        throw new IllegalArgumentException("cardCustomerId cannot be equal or lower than 0");
    }

    public List<Card> getCardById(int cardId) {
        if (getValidation().isIdValid(cardId)) {
            Card card = getCardRepository().findById(cardId);
            if (card == null) throw new NoSuchElementException("card not found");
            return List.of(card);
        }
        throw new IllegalArgumentException("cardId cannot be equal or lower than 0");
    }

    public Card postCard(Card card) {
        if (isCardValid(card)) {
            return getCardRepository().save(card);
        }
        throw new IllegalArgumentException("card object not accepted");
    }

    private boolean isCardValid(Card card) {
        if (getCustomerRepository().existsById(card.getCardCustomer().getCustomerId())) {
            String cardDate = card.getCardDate();
            String cardNo = card.getCardNo();
            String cardCvv = card.getCardCvv();
            return (cardDate.length() == 5 &&
                    cardDate.charAt(2) == '/' &&
                    cardNo.length() == 16 &&
                    cardCvv.length() == 3
            );
        }
        return false;
    }

    public void deleteCardById(int cardId) {
        if (getValidation().isIdValid(cardId)) {
            if (getCardRepository().existsById(cardId)) {
                getCardRepository().deleteById(cardId);
                return;
            }
            throw new NoSuchElementException("card not found");
        }
        throw new IllegalArgumentException("cardId cannot be equal or lower than 0");
    }

    public void deleteCardByCustomerId(int customerId) {
        if (getValidation().isIdValid(customerId)) {
            if (getCardRepository().existsByCardCustomerCustomerId(customerId)) {
                getCardRepository().deleteByCardCustomerCustomerId(customerId);
                return;
            }
            throw new NoSuchElementException("customer not found");
        }
        throw new IllegalArgumentException("customerId cannot be equal or lower than 0");
    }

    public List<Card> getAllCards() {
        return getCardRepository().findAll();
    }

    public CardRepository getCardRepository() {
        return cardRepository;
    }

    public CustomerRepository getCustomerRepository() {
        return customerRepository;
    }

    public Validation getValidation() {
        return validation;
    }
}
