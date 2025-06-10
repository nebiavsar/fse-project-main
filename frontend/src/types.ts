export interface Table {
  tableId: number;
  tableTotalCost: number;
  isTableAvailable: boolean;
  tableWaiter?: {
    employeeId: number;
    employeeName: string;
    employeeSalary: number;
    waiterTables: number;
  };
}

export interface Server {
  employeeId: number;
  employeeName: string;
  employeeSalary: number;
  waiterTables: number;
} 