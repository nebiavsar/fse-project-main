import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');

  // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
  React.useEffect(() => {
    if (!customerId) {
      navigate('/login');
    }
  }, [customerId, navigate]);

  if (!customerId) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Kullanıcı ID</h3>
              <p className="text-gray-600">{customerId}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">İsim</h3>
              <p className="text-gray-600">{customerName}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 