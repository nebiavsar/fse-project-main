import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MenuItem, Table } from '../types/index';
import { API_ENDPOINTS } from '../config/api';
import { toast } from 'react-hot-toast';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showTableDialog, setShowTableDialog] = useState(true);
  const { addItem, items: cartItems, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(true);

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const tablesResponse = await fetch(API_ENDPOINTS.TABLES.BASE);
      if (!tablesResponse.ok) throw new Error('Failed to fetch tables');
      const tablesData = await tablesResponse.json();

      const ordersResponse = await fetch(API_ENDPOINTS.ORDERS.BASE);
      if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
      const ordersData = await ordersResponse.json();

      const transformed: Table[] = tablesData.map((table: any) => {
        const hasActiveOrder = ordersData.some((order: any) => 
          order.orderTable.tableId === table.tableId && 
          order.orderStatue !== 2 && order.orderStatue !== 3
        );

        return {
          tableId: table.tableId,
          tableTotalCost: table.tableTotalCost,
          isTableAvailable: !hasActiveOrder && table.tableAvailable,
          tableWaiter: table.tableWaiter
        };
      });
      
      console.log('Processed tables:', transformed);
      setTables(transformed);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/menu-items');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();

      const transformed: MenuItem[] = data.map((item: any) => ({
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        menuItemDesc: item.menuItemDesc,
        menuItemPrice: item.menuItemPrice,
        menuItemPic: item.menuItemPic,
        menuItemCategory: item.menuItemCategory,
        menuItemStock: item.menuItemStock
      }));

      setMenuItems(transformed);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleTableSelect = (tableId: number) => {
    setSelectedTable(tableId);
    setShowTableDialog(false);
  };

  const handleCheckout = async () => {
    if (!selectedTable) {
      alert('Please select a table');
      return;
    }

    try {
      for (const item of cartItems) {
        const menuItem = menuItems.find(m => m.menuItemId === item.menuItem.menuItemId);
        if (!menuItem) {
          throw new Error(`Product ${item.menuItem.menuItemName} not found`);
        }
        if (menuItem.menuItemStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.menuItem.menuItemName}. Current stock: ${menuItem.menuItemStock}`);
        }
      }

      const expandedOrderItems = cartItems.flatMap(item => 
        Array(item.quantity).fill({
          menuItemId: item.menuItem.menuItemId
        })
      );

      const orderData = {
        orderTable: {
          tableId: selectedTable
        },
        orderPrice: totalPrice,
        orderStatue: 0,
        orderMenuItems: expandedOrderItems,
        customer: localStorage.getItem('customerId') ? {
          customerId: parseInt(localStorage.getItem('customerId')!)
        } : null
      };

      const response = await fetch(`${API_ENDPOINTS.ORDERS.BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const responseData = await response.json();
      console.log('Order created successfully:', responseData);

      for (const item of cartItems) {
        const updateStockResponse = await fetch(`${API_ENDPOINTS.MENU_ITEMS.BASE}/${item.menuItem.menuItemId}/stock?quantity=-${item.quantity}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!updateStockResponse.ok) {
          throw new Error(`Failed to update stock for ${item.menuItem.menuItemName}`);
        }
      }

      const tableResponse = await fetch(`${API_ENDPOINTS.TABLES.BY_ID(selectedTable)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: selectedTable,
          tableTotalCost: Math.round(totalPrice),
          tableAvailable: false,
          tableWaiter: null
        })
      });

      if (!tableResponse.ok) {
        throw new Error('Failed to update table status');
      }

      clearCart();
      await fetchMenuItems();
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while creating the order. Please try again.');
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAddToCart = (item: MenuItem) => {
    if (item.menuItemStock === 0) {
      toast.error('This product is out of stock!');
      return;
    }

    const currentCartItem = cartItems.find(cartItem => cartItem.menuItem.menuItemId === item.menuItemId);
    const currentQuantity = currentCartItem ? currentCartItem.quantity : 0;

    if (currentQuantity + 1 > item.menuItemStock) {
      toast.error(`You can order maximum ${item.menuItemStock} items!`);
      return;
    }

    addItem(item);
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    const menuItem = menuItems.find(item => item.menuItemId === itemId);
    if (!menuItem) return;

    if (newQuantity > menuItem.menuItemStock) {
      toast.error(`You can order maximum ${menuItem.menuItemStock} items!`);
      return;
    }

    updateQuantity(itemId, newQuantity);
  };

  if (showTableDialog) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <Card className="w-[800px] p-8 bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold mb-2">Table Selection</CardTitle>
            <CardDescription className="text-lg">Please select a table for your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {tables.map((table) => (
                <button
                  key={table.tableId}
                  onClick={() => handleTableSelect(table.tableId)}
                  disabled={!table.isTableAvailable}
                  className={`p-6 rounded-xl text-center transition-all duration-200 ${
                    table.isTableAvailable
                      ? 'bg-emerald-100 text-black hover:bg-emerald-200 hover:scale-105 shadow-md border-2 border-emerald-500'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">Table {table.tableId}</div>
                  {!table.isTableAvailable && (
                    <div className="text-sm font-medium">Occupied</div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowTableDialog(false);
                navigate('/');
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Restaurant Menu</h1>
          <span className="text-lg text-gray-600">
            Table {selectedTable}
          </span>
        </div>
        <button
          onClick={toggleCart}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
        >
          {isCartOpen ? 'Hide Cart' : 'Show Cart'}
          <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {cartItems.length}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={isCartOpen ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className={`grid grid-cols-1 ${isCartOpen ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {menuItems.map((item) => (
              <Card 
                key={item.menuItemId} 
                className={`cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative ${
                  item.menuItemStock === 0 ? 'opacity-75' : ''
                }`}
              >
                {item.menuItemPic && (
                  <div className="relative h-48 w-full">
                    <img
                      src={item.menuItemPic}
                      alt={item.menuItemName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{item.menuItemName}</CardTitle>
                  <CardDescription>{item.menuItemDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-medium">{item.menuItemPrice.toFixed(2)} TL</span>
                      <span className="text-sm text-gray-500 ml-2">{item.menuItemCategory}</span>
                    </div>
                    {item.menuItemStock === 0 ? (
                      <div className="px-4 py-2 bg-red-100 text-red-600 rounded-md">
                        Out of Stock
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {isCartOpen && (
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
                {cartItems.length === 0 && (
                  <CardDescription>Your cart is empty</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.menuItem.menuItemId} className="flex items-center justify-between space-x-4">
                      <div className="flex-1">
                        <p className="font-medium">{item.menuItem.menuItemName}</p>
                        <p className="text-sm text-gray-500">{item.menuItem.menuItemPrice.toFixed(2)} TL</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.menuItemId, item.quantity - 1)}
                          className="h-8 w-8 rounded-md border text-black border-blue-500 bg-white flex items-center justify-center hover:bg-blue-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-black">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.menuItemId, item.quantity + 1)}
                          className="h-8 w-8 rounded-md border text-black border-blue-500 bg-white flex items-center justify-center hover:bg-blue-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.menuItem.menuItemId)}
                          className="h-8 w-8 rounded-md bg-red-500 text-black flex items-center justify-center hover:bg-red-600"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={handleCheckout}
                    className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Place Order
                  </button>
                  <div className="text-xl font-bold">
                    Total: {totalPrice} TL
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
