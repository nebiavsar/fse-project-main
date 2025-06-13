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

export interface MenuItem {
  menuItemId: number;
  menuItemName: string;
  menuItemDesc: string;
  menuItemPrice: number;
  menuItemPic: string;
  menuItemCategory: string;
  menuItemStock: number;
}

// Backend'deki orderStatue değerleri
export type OrderStatus = 0 | 1 | 2; // 0: pending, 1: preparing, 2: completed

export interface OrderItem {
  menuItemId: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  orderTable: {
    tableId: number;
  };
  orderPrice: number;
  orderStatue: OrderStatus;
  orderCard?: {
    cardId: number;
  };
  orderMenuItems: MenuItem[];
}

// Frontend için ek tipler
export type FrontendOrderStatus = 'pending' | 'preparing' | 'completed';
export type PaymentMethod = 'cash' | 'credit_card' | 'mobile_payment';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
