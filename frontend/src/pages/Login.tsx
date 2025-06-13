import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8081/Customers?customerEmail=${email}`);
      
      if (response.ok) {
        const customers = await response.json();
        const customer = customers[0];

        if (customer && customer.customerPassword === password) {
          toast.success('Login successful!', {
            style: {
              background: '#22c55e',
              color: 'white',
              padding: '16px',
              borderRadius: '8px'
            }
          });
          login(customer.customerId.toString(), customer.customerName);
          navigate('/');
        } else {
          toast.error('Invalid email or password!', {
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
      } else {
        toast.error('Kullanıcı bulunamadı!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Giriş yapılırken bir hata oluştu!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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
};

export default Login; 