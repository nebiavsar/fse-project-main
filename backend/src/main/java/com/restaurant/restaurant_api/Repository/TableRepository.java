package com.restaurant.restaurant_api.Repository;

import com.restaurant.restaurant_api.Model.Table;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TableRepository extends JpaRepository<Table, Integer> {
    List<Table> findByTableWaiterEmployeeId(int tableWaiterId);

    Table findById(int tableId);

    boolean existsByTableWaiterEmployeeId(int tableWaiterId);
}
