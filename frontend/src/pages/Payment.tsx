import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import type { Order, MenuItem } from '../types/index';

const Payment = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cart sayfasından gelen sipariş bilgisini al
    const orderFromCart = location.state?.order;
    if (orderFromCart) {
      console.log('Cart sayfasından gelen sipariş:', orderFromCart);
      setOrder(orderFromCart);
      setLoading(false);
    } else {
      // Eğer state'ten sipariş gelmediyse, API'den al
      const tableId = params.tableId;
      if (!tableId) {
        toast.error('Masa ID bulunamadı');
        navigate('/cart');
        return;
      }

      const fetchOrder = async () => {
        try {
          const response = await axios.get(API_ENDPOINTS.ORDERS.BASE);
          const tableOrder = response.data.find(
            (order: Order) => 
              order.orderTable.tableId === Number(tableId) && 
              (order.orderStatue === 2 || order.orderStatue === 0)
          );
          
          if (tableOrder) {
            setOrder(tableOrder);
          } else {
            toast.error('Bu masa için bekleyen sipariş bulunamadı');
            navigate('/cart');
          }
        } catch (error) {
          console.error('Sipariş yüklenirken hata:', error);
          toast.error('Sipariş yüklenirken bir hata oluştu');
          navigate('/cart');
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [params.tableId, navigate, location.state]);

  const handlePayment = async () => {
    if (!order) return;
    
    try {
      // Ödemeyi tamamla
      await axios.put(`${API_ENDPOINTS.ORDERS.BY_ID(order.orderId)}`, {
        orderStatue: 3 // PAID
      });

      // Masa durumunu güncelle
      await axios.put(`${API_ENDPOINTS.TABLES.BY_ID(order.orderTable.tableId)}`, {
        tableId: order.orderTable.tableId,
        tableAvailable: true,
        tableTotalCost: 0
      });

      toast.success('Ödeme başarıyla tamamlandı');
      navigate('/cart');
    } catch (error) {
      console.error('Ödeme işlemi sırasında hata:', error);
      toast.error('Ödeme işlemi başarısız oldu');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  // Menü öğelerini grupla ve sayılarını hesapla
  const groupedItems = order.orderMenuItems.reduce((acc: { [key: string]: { item: MenuItem, count: number } }, item) => {
    if (!acc[item.menuItemId]) {
      acc[item.menuItemId] = { item, count: 1 };
    } else {
      acc[item.menuItemId].count++;
    }
    return acc;
  }, {});

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Masa {order.orderTable.tableId} - Sipariş Detayı</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Sipariş İçeriği</h3>
              {Object.values(groupedItems).map(({ item, count }) => (
                <div key={item.menuItemId} className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium">{item.menuItemName}</span>
                    <span className="text-gray-500 ml-2">x{count}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{item.menuItemPrice} TL</span>
                    <div className="text-sm text-gray-500">
                      Toplam: {(item.menuItemPrice * count).toFixed(2)} TL
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Genel Toplam</span>
                  <span className="text-xl font-bold text-primary">{order.orderPrice} TL</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-primary text-black py-3 px-6 rounded-md transition-colors text-lg font-semibold border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
            >
              Ödemeyi Tamamla
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;


