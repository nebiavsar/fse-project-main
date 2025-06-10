import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/payment');
  };

  if (items.length === 0) {
    return <div className="p-4">Your cart is empty</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.menuItem.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.menuItem.name}</h3>
                    <div className="text-gray-600">
                      Quantity: {item.quantity}
                      Price: ${item.menuItem.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-lg"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-lg"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.menuItem.id)}
                      className="px-3 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</div>
              <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
