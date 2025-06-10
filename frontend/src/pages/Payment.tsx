import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order, PaymentMethod } from '../types';

// Mock data for testing
const mockOrder: Order = {
  id: '1',
  tableId: 1,
  items: [
    { id: 1, name: 'Classic Burger', quantity: 2, price: 12.99 },
    { id: 2, name: 'Caesar Salad', quantity: 1, price: 8.99 }
  ],
  status: 'pending',
  total: 34.97,
  createdAt: new Date(),
  updatedAt: new Date(),
  paymentStatus: 'unpaid'
};

const Payment: React.FC = () => {
  const { orderId } = useParams();
  const [order] = useState<Order>(mockOrder);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update order with payment info
    const updatedOrder = {
      ...order,
      paymentStatus: 'paid' as const,
      paymentMethod: selectedMethod,
      updatedAt: new Date()
    };
    
    // TODO: Send to backend
    console.log('Payment processed:', updatedOrder);
    
    setProcessing(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Payment for Table {order.tableId}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t mt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h3 className="font-medium">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedMethod('credit_card')}
                  className={`p-4 rounded-md border-2 transition-colors ${
                    selectedMethod === 'credit_card'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-600'
                  }`}
                >
                  <div className="font-medium">Credit Card</div>
                  <div className="text-sm text-muted-foreground">Pay with card</div>
                </button>
                <button
                  onClick={() => setSelectedMethod('cash')}
                  className={`p-4 rounded-md border-2 transition-colors ${
                    selectedMethod === 'cash'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-600'
                  }`}
                >
                  <div className="font-medium">Cash</div>
                  <div className="text-sm text-muted-foreground">Pay in person</div>
                </button>
              </div>
            </div>

            {/* Process Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || processing}
              className={`w-full py-3 px-4 rounded-md transition-colors ${
                !selectedMethod || processing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Process Payment'
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
