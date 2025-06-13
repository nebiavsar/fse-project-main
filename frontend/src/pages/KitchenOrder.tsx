import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order, OrderStatus } from '../types/index';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

interface KitchenOrder extends Order {
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const KitchenOrder: React.FC = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS.BASE);
      if (!response.ok) throw new Error('Failed to load orders');
      
      const data = await response.json();
      const transformedOrders: KitchenOrder[] = data
        .filter((order: any) => order.orderStatue !== 3) // Filter out paid orders
        .map((order: any) => {
          const itemMap = new Map<number, OrderItem>();
          
          order.orderMenuItems.forEach((item: any) => {
            const existingItem = itemMap.get(item.menuItemId);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              itemMap.set(item.menuItemId, {
                menuItemId: item.menuItemId,
                name: item.menuItemName,
                price: item.menuItemPrice,
                quantity: 1
              });
            }
          });

          return {
            ...order,
            items: Array.from(itemMap.values()),
            createdAt: new Date(),
            updatedAt: new Date()
          };
        });
      
      setOrders(transformedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    if (!isAdmin) return; // Only admin users can update order status

    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS.BASE}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderStatue: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // Reload orders after successful update
      await fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800'; // pending
      case 1: return 'bg-blue-100 text-blue-800';     // preparing
      case 2: return 'bg-green-100 text-green-800';   // completed
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Preparing';
      case 2: return 'Completed';
      default: return 'Paid';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 0: return 1; // pending -> preparing
      case 1: return 2; // preparing -> completed
      case 2: return null; // completed -> no next status
      default: return null;
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {isAdmin ? 'Kitchen Orders' : 'Order Status'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <Card key={order.orderId} className="overflow-hidden">
            <CardHeader className="bg-background border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Table {order.orderTable.tableId}</CardTitle>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatue)}`}>
                  {getStatusText(order.orderStatue)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-gray-500">₺{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>₺{order.orderPrice}</span>
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      const nextStatus = getNextStatus(order.orderStatue);
                      if (nextStatus !== null) {
                        updateOrderStatus(order.orderId, nextStatus);
                      }
                    }}
                    disabled={getNextStatus(order.orderStatue) === null}
                    className="w-full"
                  >
                    {order.orderStatue === 0 ? 'Start Preparing' :
                     order.orderStatue === 1 ? 'Mark as Completed' :
                     'Order Completed'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenOrder;