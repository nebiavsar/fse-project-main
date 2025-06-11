import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from './contexts/CartContext';
import './App.css';
import Menu from './pages/Menu';
import MenuManagement from './pages/MenuManagement';
import Home from './pages/Home';
import TableManagement from './pages/TableManagement';
import Cart from './pages/Cart';
import KitchenOrder from './pages/KitchenOrder';
import Payment from './pages/Payment';
import { Suspense } from 'react';
import Admin from './pages/Admin';
import { Toaster, toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import Profile from './pages/Profile';

const Header = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            {isAdmin ? (
              <>
                <Link to="/table-management" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Tables</Link>
                <Link to="/kitchen" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Kitchen</Link>
                <Link to="/management" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Menu Management</Link>
              </>
            ) : (
              <>
                <Link to="/" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Home</Link>
                <Link to="/menu" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Menu</Link>
                <Link to="/profile" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Profile</Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <Link 
                to="/cart" 
                className="inline-flex h-11 items-center justify-center rounded-full border border-orange-500 bg-gradient-to-r from-orange-400 to-orange-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105"
              >
                Payments {totalItems > 0 && <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">{totalItems}</span>}
              </Link>
            ) : (
              <Link 
                to="/cart" 
                className="inline-flex h-11 items-center justify-center rounded-full border border-orange-500 bg-gradient-to-r from-orange-400 to-orange-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105"
              >
                Cart {totalItems > 0 && <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">{totalItems}</span>}
              </Link>
            )}

            {isLoggedIn ? (
              <Button 
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Logout
              </Button>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <CartProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-background text-foreground">
          <Header />

          {/* Main Content */}
          <main className="pt-4">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/table-management" element={<TableManagement />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment/:tableId" element={<Payment />} />
                <Route path="/kitchen" element={<KitchenOrder />} />
                <Route path="/management" element={<MenuManagement />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
