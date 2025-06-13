package com.restaurant.restaurant_api;

import com.restaurant.restaurant_api.Model.Order;
import com.restaurant.restaurant_api.Repository.*;
import com.restaurant.restaurant_api.Service.OrderService;
import com.restaurant.restaurant_api.Validation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class RestaurantApiApplicationTests {

	private OrderRepository orderRepository;
	private TableRepository tableRepository;
	private MenuItemRepository menuItemRepository;
	private CardRepository cardRepository;
	private Validation validation;
	private OrderService orderService;

	@BeforeEach
	void setup() {
		orderRepository = mock(OrderRepository.class);
		tableRepository = mock(TableRepository.class);
		menuItemRepository = mock(MenuItemRepository.class);
		cardRepository = mock(CardRepository.class);
		validation = mock(Validation.class);

		orderService = new OrderService(
				orderRepository,
				tableRepository,
				menuItemRepository,
				cardRepository,
				validation
		);
	}



	@Test
	void testGetAllOrdersReturnsOrders() {
		when(orderRepository.findAll()).thenReturn(List.of(new Order(), new Order()));

		List<Order> result = orderService.getAllOrders();

		assertEquals(2, result.size());
		verify(orderRepository, times(1)).findAll();
	}




	@Test
	void testGetOrderById_invalidId_throwsException() {
		when(validation.isIdValid(-5)).thenReturn(false);

		assertThrows(IllegalArgumentException.class, () -> {
			orderService.getOrderById(-5);
		});
	}


	@Test
	void testDeleteOrderById_validAndExists_deletesOrder() {
		when(validation.isIdValid(1)).thenReturn(true);
		when(orderRepository.existsById(1)).thenReturn(true);

		orderService.deleteOrderById(1);

		verify(orderRepository).deleteById(1);
	}


	@Test
	void testDeleteOrderById_notExists_throwsException() {
		when(validation.isIdValid(99)).thenReturn(true);
		when(orderRepository.existsById(99)).thenReturn(false);

		assertThrows(NoSuchElementException.class, () -> {
			orderService.deleteOrderById(99);
		});
	}
}
