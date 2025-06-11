import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import type { Order, Table } from '../types/index';

const Cart: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId') ? parseInt(localStorage.getItem('customerId')!) : null;

  useEffect(() => {
    fetchTables();
    fetchOrders();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.TABLES.BASE);
      const occupiedTables = response.data.filter((table: Table) => !table.tableAvailable);
      setTables(occupiedTables);
    } catch (error) {
      console.error('Masalar yüklenirken hata:', error);
      toast.error('Masalar yüklenirken bir hata oluştu');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS.BASE);
      const pendingOrders = response.data.filter((order: any) => 
        order.orderStatue === 2 || order.orderStatue === 0
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      toast.error('Siparişler yüklenirken bir hata oluştu');
    }
  };

  const handlePayment = (tableId: number) => {
    const tableOrder = orders.find(order => 
      order.orderTable.tableId === tableId && 
      (order.orderStatue === 2 || order.orderStatue === 0)
    );

    if (tableOrder) {
      console.log('Ödeme sayfasına yönlendiriliyor:', tableOrder);
      navigate(`/payment/${tableId}`, { state: { order: tableOrder } });
    } else {
      toast.error('Bu masa için bekleyen sipariş bulunamadı');
    }
  };

  // Giriş yapmış kullanıcı için sadece kendi masalarını filtrele
  const filteredTables = customerId
    ? tables.filter(table => {
        const tableOrder = orders.find(order => 
          order.orderTable.tableId === table.tableId && 
          order.customer?.customerId === customerId
        );
        return tableOrder !== undefined;
      })
    : tables;

  if (filteredTables.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">
          {customerId ? 'Siparişlerim' : 'Ödeme Bekleyen Masalar'}
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500">
            {customerId 
              ? 'Şu anda bekleyen siparişiniz bulunmuyor.'
              : 'Şu anda ödeme bekleyen masa bulunmuyor.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {customerId ? 'Siparişlerim' : 'Ödeme Bekleyen Masalar'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table) => {
          const tableOrder = orders.find(order => 
            order.orderTable.tableId === table.tableId && 
            (!customerId || order.customer?.customerId === customerId)
          );
          return (
            <Card key={table.tableId}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Masa {table.tableId}</h2>
                    <p className="text-gray-600">Toplam Tutar: {table.tableTotalCost} TL</p>
                    {tableOrder && (
                      <p className="text-sm text-gray-500">
                        Sipariş Durumu: {tableOrder.orderStatue === 2 ? 'Hazır' : 'Hazırlanıyor'}
                      </p>
                    )}
                  </div>
                  <span className="text-lg font-bold text-red-600">Ödeme Bekliyor</span>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => handlePayment(table.tableId)}
                    className="w-full bg-primary text-black py-3 px-6 rounded-md transition-colors text-lg font-semibold border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    Ödeme Yap
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
