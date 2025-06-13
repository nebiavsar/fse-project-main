import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '@/config/api';

interface MenuItem {
  menuItemId: number;
  menuItemName: string;
  menuItemPrice: number;
}

interface Order {
  orderId: number;
  orderPrice: number;
  orderMenuItems: MenuItem[];
}

const Admin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginInfo, setLoginInfo] = useState<{ username: string; password: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      fetchOrders();
    }

    fetch('/logininformation.txt')
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const info = {
          username: lines[0].split(':')[1].trim(),
          password: lines[1].split(':')[1].trim()
        };
        setLoginInfo(info);
      })
      .catch((error) => {
        console.error('Login bilgileri yüklenirken hata:', error);
        toast.error('Login bilgileri yüklenemedi');
      });
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS.BASE);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      toast.error('Siparişler yüklenemedi');
    }
  };

  const calculateSalesReport = () => {
    const totalSales = orders.reduce((sum, order) => sum + order.orderPrice, 0);
    const totalOrders = orders.length;

    // Popüler ürünleri hesapla
    const itemCounts = new Map<string, { quantity: number; revenue: number }>();
    
    orders.forEach(order => {
      order.orderMenuItems.forEach(item => {
        const current = itemCounts.get(item.menuItemName) || { quantity: 0, revenue: 0 };
        itemCounts.set(item.menuItemName, {
          quantity: current.quantity + 1,
          revenue: current.revenue + item.menuItemPrice
        });
      });
    });

    const popularItems = Array.from(itemCounts.entries())
      .map(([name, stats]) => ({
        name,
        quantity: stats.quantity,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5); // En popüler 5 ürün

    return { totalSales, totalOrders, popularItems };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginInfo) {
      toast.error('Login bilgileri yüklenemedi');
      return;
    }

    if (username === loginInfo.username && password === loginInfo.password) {
      toast.success('Giriş başarılı!', {
        style: {
          background: '#22c55e',
          color: 'white',
          padding: '16px',
          borderRadius: '8px'
        }
      });
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAdmin', 'true');
      fetchOrders();
    } else {
      setUsername('');
      setPassword('');
      toast.error('Kullanıcı adı veya şifre hatalı!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px'
        }
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    setOrders([]);
    toast.success('Çıkış yapıldı');
  };

  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Girişi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Kullanıcı Adı
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı girin"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Şifre
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-black hover:bg-orange-500 hover:text-white"
              >
                Giriş Yap
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { totalSales, totalOrders, popularItems } = calculateSalesReport();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Paneli</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Toplam Satış</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₺{totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Toplam Sipariş</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Popüler Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Satış Adedi: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₺{item.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
