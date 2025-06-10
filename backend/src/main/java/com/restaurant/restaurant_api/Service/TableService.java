package com.restaurant.restaurant_api.Service;


import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Repository.TableRepository;
import com.restaurant.restaurant_api.Repository.WaiterRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TableService {

    private final TableRepository tableRepository;
    private final WaiterRepository waiterRepository;
    private final Validation validation;

    public TableService(TableRepository tableRepository, Validation validation, WaiterRepository waiterRepository) {
        this.tableRepository = tableRepository;
        this.validation = validation;
        this.waiterRepository = waiterRepository;
    }
    public List<Table> getAllTables() {
        List<Table> tables = getTableRepository().findAll();
        System.out.println("Tüm masalar getirildi: " + tables);
        return tables;
    }

    public List<Table> getTableByWaiterId(int tableWaiterId) {
        if (getValidation().isIdValid(tableWaiterId)) {
            List<Table> tables = getTableRepository().findByTableWaiterEmployeeId(tableWaiterId);
            System.out.println("Garson ID'ye göre masalar getirildi: " + tables);
            return tables;
        }
        throw new IllegalArgumentException("tableWaiterId cannot be equal or lower than 0");
    }

    public List<Table> getTableById(int tableId) {
        if (getValidation().isIdValid(tableId)) {
            Table table = getTableRepository().findById(tableId);
            if (table == null) throw new NoSuchElementException("table is not found");
            System.out.println("Masa ID'ye göre masa getirildi: " + table);
            return List.of(table);
        }
        throw new IllegalArgumentException("tableId cannot be equal or lower than 0");
    }

    public Table postTable(Table table) {
        System.out.println("Masa kaydediliyor: " + table);
        if (table.getTableWaiter() != null) {
            if (getWaiterRepository().existsById(table.getTableWaiter().getEmployeeId())) {
                table.setTableAvailable(true);
                Table savedTable = getTableRepository().save(table);
                System.out.println("Masa kaydedildi: " + savedTable);
                return savedTable;
            }
            throw new NoSuchElementException("waiter is not found");
        }
        table.setTableAvailable(true);
        Table savedTable = getTableRepository().save(table);
        System.out.println("Masa kaydedildi: " + savedTable);
        return savedTable;
    }

    public void deleteTableById(int tableId) {
        if (getValidation().isIdValid(tableId)) {
            if (getTableRepository().existsById(tableId)) {
                getTableRepository().deleteById(tableId);
                System.out.println("Masa silindi: " + tableId);
                return;
            }
            throw new NoSuchElementException("table is not found");
        }
        throw new IllegalArgumentException("tableId cannot be equal or lower than 0");
    }

    public void deleteByTableWaiterId(int tableWaiterId) {
        if (getValidation().isIdValid(tableWaiterId)) {
            if (getTableRepository().existsByTableWaiterEmployeeId(tableWaiterId)) {
                getTableRepository().deleteById(tableWaiterId);
                System.out.println("Garson ID'ye göre masalar silindi: " + tableWaiterId);
                return;
            }
            throw new NoSuchElementException("waiter is not found");
        }
        throw new IllegalArgumentException("tableWaiterId cannot be equal or lower than 0");
    }

    public Table putByTableId(int tableId, Table table) {
        System.out.println("Masa güncelleniyor. ID: " + tableId + ", Veri: " + table);
        if (getValidation().isIdValid(tableId)) {
            Table oldTable = getTableRepository().findById(tableId);
            if (oldTable != null) {
                oldTable.setTableAvailable(table.isTableAvailable());
                oldTable.setTableTotalCost(table.getTableTotalCost());
                if (table.getTableWaiter() != null) {
                    if (getValidation().isIdValid(table.getTableWaiter().getEmployeeId())) {
                        if (getWaiterRepository().existsById(table.getTableWaiter().getEmployeeId())) {
                            oldTable.setTableWaiter(table.getTableWaiter());
                            Table updatedTable = getTableRepository().save(oldTable);
                            System.out.println("Masa güncellendi: " + updatedTable);
                            return updatedTable;
                        }
                        throw new NoSuchElementException("waiter is not found");
                    }
                    throw new IllegalArgumentException("tableWaiterId cannot be equal or lower than 0");
                }
                oldTable.setTableWaiter(table.getTableWaiter());
                Table updatedTable = getTableRepository().save(oldTable);
                System.out.println("Masa güncellendi: " + updatedTable);
                return updatedTable;
            }
            throw new NoSuchElementException("table is not found");
        }
        throw new IllegalArgumentException("tableId cannot be equal or lower than 0");
    }

    public TableRepository getTableRepository() {
        return tableRepository;
    }

    public WaiterRepository getWaiterRepository() {
        return waiterRepository;
    }

    public Validation getValidation() {
        return validation;
    }
}
