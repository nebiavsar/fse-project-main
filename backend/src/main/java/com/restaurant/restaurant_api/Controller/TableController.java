package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Service.TableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/Tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<List<Table>> getTables(
            @RequestParam(required = false) Integer tableId,
            @RequestParam(required = false) Integer tableWaiterId
    ) {
        System.out.println("GET /Tables isteği alındı");
        if (tableId == null && tableWaiterId == null) {
            List<Table> tables = getTableService().getAllTables();
            System.out.println("Tüm masalar getirildi: " + tables);
            return new ResponseEntity<>(tables, HttpStatus.OK);
        }
        else if (tableId == null) {
            List<Table> tables = getTableService().getTableByWaiterId(tableWaiterId);
            System.out.println("Garson ID'ye göre masalar getirildi: " + tables);
            return new ResponseEntity<>(tables, HttpStatus.OK);
        }
        else {
            List<Table> tables = getTableService().getTableById(tableId);
            System.out.println("Masa ID'ye göre masalar getirildi: " + tables);
            return new ResponseEntity<>(tables, HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Table> postATable(@RequestBody Table table) {
        System.out.println("POST /Tables isteği alındı. Gelen veri: " + table);
        if (table != null) {
            Table savedTable = getTableService().postTable(table);
            System.out.println("Masa kaydedildi: " + savedTable);
            return new ResponseEntity<>(savedTable, HttpStatus.CREATED);
        }
        System.out.println("Geçersiz masa verisi");
        return new ResponseEntity<>(new Table(), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{tableId}")
    public ResponseEntity<Void> deleteATable(@PathVariable int tableId) {
        System.out.println("DELETE /Tables/" + tableId + " isteği alındı");
        getTableService().deleteTableById(tableId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/byWaiter/{waiterId}")
    public ResponseEntity<Void> deleteTablesByWaiter(@PathVariable int tableWaiterId) {
        System.out.println("DELETE /Tables/byWaiter/" + tableWaiterId + " isteği alındı");
        getTableService().deleteByTableWaiterId(tableWaiterId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{tableId}")
    public ResponseEntity<Table> putATable(@PathVariable int tableId, @RequestBody Table table) {
        System.out.println("PUT /Tables/" + tableId + " isteği alındı. Gelen veri: " + table);
        if (table != null) {
            Table updatedTable = getTableService().putByTableId(tableId, table);
            System.out.println("Masa güncellendi: " + updatedTable);
            return new ResponseEntity<>(updatedTable, HttpStatus.CREATED);
        }
        System.out.println("Geçersiz masa verisi");
        return new ResponseEntity<>(new Table(), HttpStatus.BAD_REQUEST);
    }

    public TableService getTableService() {
        return tableService;
    }
}
