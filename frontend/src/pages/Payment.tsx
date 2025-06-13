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
  const [showCardForm, setShowCardForm] = useState(false);
  const [showCashConfirmation, setShowCashConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    firstName: '',
    lastName: ''
  });
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    // Get order information from Cart page
    const orderFromCart = location.state?.order;
    if (orderFromCart) {
      console.log('Order from Cart page:', orderFromCart);
      setOrder(orderFromCart);
      setLoading(false);
    } else {
      // If no order from state, get from API
      const tableId = params.tableId;
      if (!tableId) {
        toast.error('Table ID not found');
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
            toast.error('No pending order found for this table');
            navigate('/cart');
          }
        } catch (error) {
          console.error('Error loading order:', error);
          toast.error('An error occurred while loading the order');
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
      // Complete payment
      await axios.put(`${API_ENDPOINTS.ORDERS.BY_ID(order.orderId)}`, {
        orderStatue: 3, // PAID
        paymentMethod: paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : null
      });

      // Update table status
      await axios.put(`${API_ENDPOINTS.TABLES.BY_ID(order.orderTable.tableId)}`, {
        tableId: order.orderTable.tableId,
        tableAvailable: true,
        tableTotalCost: 0
      });

      toast.success('Payment completed successfully');
      navigate('/cart');
    } catch (error) {
      console.error('Error during payment process:', error);
      toast.error('Payment process failed');
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePayment();
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

  // Credit card form
  if (showCardForm) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Credit Card Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-2 border rounded-md"
                    value={cardDetails.firstName}
                    onChange={(e) => setCardDetails({...cardDetails, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-2 border rounded-md"
                    value={cardDetails.lastName}
                    onChange={(e) => setCardDetails({...cardDetails, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border rounded-md"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full p-2 border rounded-md"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="123"
                    className="w-full p-2 border rounded-md"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-black py-3 px-6 rounded-md transition-colors text-lg font-semibold border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Complete Payment
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Cash payment confirmation form
  if (showCashConfirmation) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cash Payment Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg mb-4">Total Amount: <span className="font-bold text-primary">{order.orderPrice} TL</span></p>
                <p className="text-gray-600 mb-6">Please confirm after receiving the payment.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCashConfirmation(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md transition-colors text-lg font-semibold hover:bg-gray-300"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('cash');
                    handlePayment();
                  }}
                  className="flex-1 bg-primary text-black py-3 px-6 rounded-md transition-colors text-lg font-semibold border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Paid in Cash
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Table {order.orderTable.tableId} - Order Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Order Contents</h3>
              {Object.values(groupedItems).map(({ item, count }) => (
                <div key={item.menuItemId} className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium">{item.menuItemName}</span>
                    <span className="text-gray-500 ml-2">x{count}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{item.menuItemPrice} TL</span>
                    <div className="text-sm text-gray-500">
                      Total: {(item.menuItemPrice * count).toFixed(2)} TL
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Grand Total</span>
                  <span className="text-xl font-bold text-primary">{order.orderPrice} TL</span>
                </div>
              </div>
            </div>

            {isAdmin ? (
              <button
                onClick={handlePayment}
                className="w-full bg-primary text-black py-3 px-6 rounded-md transition-colors text-lg font-semibold border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Complete Payment
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowCashConfirmation(true)}
                    className="p-4 border-2 border-white-500 bg-white-500 text-white rounded-md hover:bg-green-600 hover:border-green-600 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl">💵</span>
                      <p className="mt-2 font-medium">Cash</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('card');
                      setShowCardForm(true);
                    }}
                    className="p-4 border-2 border-white-500 bg-white-500 text-white rounded-md hover:bg-blue-600 hover:border-blue-600 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl">💳</span>
                      <p className="mt-2 font-medium">Credit Card</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;


