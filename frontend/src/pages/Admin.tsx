import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface MenuItem {
  menuItemId: number;
  menuItemName: string;
  menuItemPrice: number;
  menuItemStock: number;
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, login, logout } = useAuth();

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchOrders();
      fetchMenuItems();
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
        console.error('Error loading login information:', error);
        toast.error('Failed to load login information');
      });
  }, [isLoggedIn, isAdmin]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS.BASE);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MENU_ITEMS.BASE);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error('Failed to load menu items');
    }
  };

  const calculateSalesReport = () => {
    const totalSales = orders.reduce((sum, order) => sum + order.orderPrice, 0);
    const totalOrders = orders.length;

    // Calculate popular items
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
      .slice(0, 5); // Top 5 popular items

    return { totalSales, totalOrders, popularItems };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginInfo) {
      toast.error('Failed to load login information');
      return;
    }

    if (username === loginInfo.username && password === loginInfo.password) {
      toast.success('Login successful!', {
        style: {
          background: '#22c55e',
          color: 'white',
          padding: '16px',
          borderRadius: '8px'
        }
      });
      login('admin', 'Admin', true);
      fetchOrders();
    } else {
      setUsername('');
      setPassword('');
      toast.error('Invalid username or password!', {
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
    logout();
    setOrders([]);
    toast.success('Logged out successfully');
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-black hover:bg-orange-500 hover:text-white"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { totalSales, totalOrders, popularItems } = calculateSalesReport();
  const lowStockItems = menuItems.filter(item => item.menuItemStock <= 10);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₺{totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity Sold: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₺{item.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Status */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Stock Status</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">All items have sufficient stock.</p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <p className="font-medium">{item.menuItemName}</p>
                      <p className="text-sm text-gray-600">Remaining Stock: {item.menuItemStock}</p>
                    </div>
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">
                        {item.menuItemStock === 0 ? 'Out of stock!' : 'Low stock!'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
