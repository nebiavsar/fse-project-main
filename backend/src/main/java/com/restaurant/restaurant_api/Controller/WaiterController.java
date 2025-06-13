package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.Waiter;
import com.restaurant.restaurant_api.Service.WaiterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/Waiters")
public class WaiterController {

    private final WaiterService waiterService;

    public WaiterController(WaiterService waiterService) {
        this.waiterService = waiterService;
    }

    @GetMapping
    public ResponseEntity<List<Waiter>> getWaiters(@RequestParam(required = false) Integer employeeId) {
        if (employeeId == null) {
            return new ResponseEntity<>(getWaiterService().getAllWaiters(), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(getWaiterService().getWaiterById(employeeId), HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Waiter> postAWaiter(@RequestBody Waiter waiter) {
        if (waiter != null) {
            return new ResponseEntity<>(getWaiterService().postWaiter(waiter), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new Waiter(), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> deleteAWaiter(@PathVariable int employeeId) {
        getWaiterService().deleteWaiterById(employeeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<Waiter> putAWaiter(@PathVariable int employeeId, @RequestBody Waiter waiter) {
        if (waiter != null) {
            return new ResponseEntity<>(getWaiterService().putByEmployeeId(employeeId, waiter), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Waiter(), HttpStatus.BAD_REQUEST);
    }

    public WaiterService getWaiterService() {
        return waiterService;
    }
}
