import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order, OrderStatus } from '../types/index';
import { API_ENDPOINTS } from '../config/api';

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS.BASE);
      if (!response.ok) throw new Error('Siparişler yüklenirken bir hata oluştu');
      
      const data = await response.json();
      const transformedOrders: KitchenOrder[] = data.map((order: any) => {
        // Aynı menuItemId'ye sahip öğeleri birleştir
        const itemMap = new Map<number, OrderItem>();
        
        order.orderMenuItems.forEach((item: any) => {
          const existingItem = itemMap.get(item.menuItemId);
          if (existingItem) {
            // Eğer öğe zaten varsa quantity'yi artır
            existingItem.quantity += 1;
          } else {
            // Yeni öğe ekle
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
      setError('Siparişler yüklenirken bir hata oluştu');
      console.error('Sipariş yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
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

      if (!response.ok) throw new Error('Sipariş durumu güncellenirken bir hata oluştu');

      // Başarılı güncelleme sonrası siparişleri yeniden yükle
      await fetchOrders();
    } catch (err) {
      console.error('Sipariş durumu güncelleme hatası:', err);
      alert('Sipariş durumu güncellenirken bir hata oluştu');
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
      case 0: return 'Beklemede';
      case 1: return 'Hazırlanıyor';
      case 2: return 'Tamamlandı';
      default: return 'Bilinmiyor';
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

  if (loading) return <div className="container mx-auto p-4">Yükleniyor...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Mutfak Siparişleri</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <Card key={order.orderId} className="overflow-hidden">
            <CardHeader className="bg-background border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Masa {order.orderTable.tableId}</CardTitle>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatue)}`}>
                  {getStatusText(order.orderStatue)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.menuItemId} className="flex justify-between items-center">
                      <span className="font-medium">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.price * item.quantity} TL
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Sipariş: {order.createdAt.toLocaleTimeString()}
                    </span>
                    {getNextStatus(order.orderStatue) !== null && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, getNextStatus(order.orderStatue)!)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {getNextStatus(order.orderStatue) === 1 ? 'Hazırlanmaya Başla' : 'Tamamlandı Olarak İşaretle'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenOrder;