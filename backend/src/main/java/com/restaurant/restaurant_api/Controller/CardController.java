package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.Card;
import com.restaurant.restaurant_api.Service.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/Cards")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public ResponseEntity<List<Card>> getCards(
            @RequestParam(required = false) Integer cardCustomerId,
            @RequestParam(required = false) Integer cardId
    ) {
        if (cardCustomerId == null && cardId == null) {
            return new ResponseEntity<>(getCardService().getAllCards(), HttpStatus.OK);
        }
        else if (cardCustomerId == null) {
            return new ResponseEntity<>(getCardService().getCardById(cardId), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(getCardService().getAllCardsForCustomer(cardCustomerId), HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Card> postACard(@RequestBody Card card) {
        if (card != null) {
            return new ResponseEntity<>(getCardService().postCard(card), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new Card(), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> deleteCardById(@PathVariable int cardId) {
        getCardService().deleteCardById(cardId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/byCustomer/{customerId}")
    public ResponseEntity<Void> deleteCardByCustomerId(@PathVariable int customerId) {
        getCardService().deleteCardByCustomerId(customerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public CardService getCardService() {
        return cardService;
    }
}
