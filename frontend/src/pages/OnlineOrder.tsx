import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import type { Order, MenuItem } from '../types';

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and our special sauce',
    price: 12.99,
    category: 'Main Course',
    image: 'burger.jpg'
  },
  {
    id: 2,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons with Caesar dressing',
    price: 8.99,
    category: 'Starters',
    image: 'caesar-salad.jpg'
  }
];

const OnlineOrder: React.FC = () => {
  const { tableId } = useParams();
  const { items: cart, addItem, removeItem, updateQuantity } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const selectedTable = tableId ? parseInt(tableId, 10) : 1;

  const handleAddToCart = (menuItem: MenuItem) => {
    addItem(menuItem);
  };

  const handleRemoveFromCart = (menuItemId: number) => {
    removeItem(menuItemId);
  };

  const handleUpdateQuantity = (menuItemId: number, quantity: number) => {
    updateQuantity(menuItemId, quantity);
  };

  const submitOrder = () => {
    const cartItems = cart.map(item => ({
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
      id: item.menuItem.id
    }));

    const total = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      items: cartItems.map(item => ({
        id: item.menuItemId,
        name: item.name || `Item #${item.menuItemId}`,
        quantity: item.quantity,
        price: item.price || 0,
        menuItemId: item.menuItemId,
        status: 'pending'
      })),
      tableId: selectedTable,
      status: 'pending',
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: 'unpaid'
    };

    setOrders([...orders, newOrder]);
    // Clear cart after order
    cart.forEach(item => removeItem(item.menuItem.id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Menu Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <div className="grid gap-4">
            {mockMenuItems.map((item) => (
              <Card key={item.id} className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleAddToCart(item)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart & Orders Section */}
        <div className="space-y-8">
          {/* Current Cart */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <Card key={item.menuItem.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.menuItem.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.menuItem.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveFromCart(item.menuItem.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="px-2 py-1 rounded-md bg-secondary"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
                <button
                  onClick={submitOrder}
                  className="w-full py-2 px-4 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors"
                >
                  Submit Order
                </button>
              </div>
            )}
          </div>

          {/* Previous Orders */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        Order #{order.id}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.createdAt.toLocaleTimeString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x Item #{item.menuItemId}</span>
                          <span className="capitalize">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineOrder;
