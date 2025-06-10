package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.Order;
import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(required = false) Integer orderId,
            @RequestParam(required = false) Integer orderTableId
    ) {
        if (orderId == null && orderTableId == null) {
            return new ResponseEntity<>(getOrderService().getAllOrders(), HttpStatus.OK);
        }
        else if (orderId == null) {
            return new ResponseEntity<>(getOrderService().getOrderByTableId(orderTableId), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(getOrderService().getOrderById(orderId), HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Order> postAOrder(@RequestBody Order order) {
        if (order != null) {
            return new ResponseEntity<>(getOrderService().postOrder(order), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new Order(), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteAOrder(@PathVariable int orderId) {
        getOrderService().deleteOrderById(orderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/byTable/{orderTableId}")
    public ResponseEntity<Void> deleteOrdersByTable(@PathVariable int orderTableId) {
        getOrderService().deleteByOrderTableId(orderTableId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<Order> putAOrder(@PathVariable int orderId, @RequestBody Order order) {
        if (order != null) {
            return new ResponseEntity<>(getOrderService().putByOrderId(orderId, order), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new Order(), HttpStatus.BAD_REQUEST);
    }

    public OrderService getOrderService() {
        return orderService;
    }
}
