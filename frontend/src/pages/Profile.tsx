import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { Order } from '../types/index';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  const [orders, setOrders] = useState<Order[]>([]);

  // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
  React.useEffect(() => {
    if (!customerId) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [customerId, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS.BASE);
      // Filter only paid orders (orderStatue === 3)
      const paidOrders = response.data.filter((order: any) => 
        order.customer?.customerId === parseInt(customerId!) && 
        order.orderStatue === 3
      );
      setOrders(paidOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  if (!customerId) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            <div>
              <h3 className="text-lg font-semibold">Name</h3>
              <p className="text-gray-600">{customerName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">You have no paid orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.orderId} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Table {order.orderTable.tableId}</h3>
                      <div className="mt-2">
                        <h4 className="font-medium">Order Contents:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {Object.entries(
                            order.orderMenuItems.reduce((acc: { [key: string]: { count: number; price: number; name: string } }, item: any) => {
                              const key = `${item.menuItemId}-${item.menuItemName}`;
                              if (!acc[key]) {
                                acc[key] = { count: 1, price: item.menuItemPrice, name: item.menuItemName };
                              } else {
                                acc[key].count++;
                              }
                              return acc;
                            }, {})
                          ).map(([key, item]) => (
                            <li key={key}>
                              {item.count}x {item.name} - {item.price} TL
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{order.orderPrice} TL</p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 