import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Şifre kontrolü
    if (formData.customerPassword !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/Customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPassword: formData.customerPassword
        }),
      });

      if (response.ok) {
        toast.success('Hesabınız başarıyla oluşturuldu!');
        navigate('/login');
      } else {
        const error = await response.text();
        toast.error(error || 'Hesap oluşturulurken bir hata oluştu!');
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Hesap Oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="customerName" className="text-sm font-medium">
                Ad Soyad
              </label>
              <Input
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Adınızı ve soyadınızı girin"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="customerEmail" className="text-sm font-medium">
                E-posta
              </label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="E-posta adresinizi girin"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="customerPassword" className="text-sm font-medium">
                Şifre
              </label>
              <Input
                id="customerPassword"
                name="customerPassword"
                type="password"
                value={formData.customerPassword}
                onChange={handleChange}
                placeholder="Şifrenizi girin"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Şifre Tekrar
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Şifrenizi tekrar girin"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-black hover:bg-orange-500 hover:text-white"
            >
              Hesap Oluştur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn; 