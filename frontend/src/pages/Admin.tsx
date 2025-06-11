import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const Admin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginInfo, setLoginInfo] = useState<{ username: string; password: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Oturum zaten açıksa yönlendir
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/admin/tables');
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
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginInfo) {
      toast.error('Login bilgileri yüklenemedi');
      return;
    }

    if (username === loginInfo.username && password === loginInfo.password) {
      toast.success('Giriş başarılı!', {
        style: {
          background: '#22c55e', // yeşil
          color: 'white',
          padding: '16px',
          borderRadius: '8px'
        }
      });
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/tables');
    } else {
      setUsername('');
      setPassword('');
      toast.error('Kullanıcı adı veya şifre hatalı!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#ef4444', // kırmızı
          color: '#fff',
          padding: '16px',
          borderRadius: '8px'
        }
      });
    }
  };

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
};

export default Admin;
