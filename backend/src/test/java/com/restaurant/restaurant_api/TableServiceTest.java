package com.restaurant.restaurant_api;



import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Model.Employee;
import com.restaurant.restaurant_api.Repository.TableRepository;
import com.restaurant.restaurant_api.Repository.WaiterRepository;
import com.restaurant.restaurant_api.Service.TableService;
import com.restaurant.restaurant_api.Validation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TableServiceTest {

    private TableRepository tableRepository;
    private WaiterRepository waiterRepository;
    private Validation validation;
    private TableService tableService;

    @BeforeEach
    public void setUp() {
        tableRepository = mock(TableRepository.class);
        waiterRepository = mock(WaiterRepository.class);
        validation = mock(Validation.class);
        tableService = new TableService(tableRepository, validation, waiterRepository);
    }

    @Test
    public void testGetAllTables() {
        System.out.println("TEST: getAllTables - Tüm masaların başarıyla getirildiği test ediliyor.");
        when(tableRepository.findAll()).thenReturn(List.of(new Table(), new Table()));

        List<Table> result = tableService.getAllTables();
        assertEquals(2, result.size());

        System.out.println("SONUÇ: testGetAllTables PASSED");
    }

    @Test
    public void testGetTableById_ValidId() {
        System.out.println("TEST: getTableById - Geçerli ID ile masa getiriliyor mu test ediliyor.");
        Table table = new Table();
        when(validation.isIdValid(1)).thenReturn(true);
        when(tableRepository.findById(1)).thenReturn(table);

        List<Table> result = tableService.getTableById(1);
        assertEquals(1, result.size());

        System.out.println("SONUÇ: testGetTableById_ValidId PASSED");
    }

    @Test
    public void testGetTableById_InvalidId() {
        System.out.println("TEST: getTableById - Geçersiz ID ile IllegalArgumentException fırlatılıyor mu test ediliyor.");
        when(validation.isIdValid(-1)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> tableService.getTableById(-1));
        System.out.println("SONUÇ: testGetTableById_InvalidId PASSED");
    }



    @Test
    public void testDeleteTableById_TableExists() {
        System.out.println("TEST: deleteTableById - Mevcut masa başarıyla siliniyor mu test ediliyor.");
        when(validation.isIdValid(1)).thenReturn(true);
        when(tableRepository.existsById(1)).thenReturn(true);
        doNothing().when(tableRepository).deleteById(1);

        assertDoesNotThrow(() -> tableService.deleteTableById(1));
        System.out.println("SONUÇ: testDeleteTableById_TableExists PASSED");
    }


}



