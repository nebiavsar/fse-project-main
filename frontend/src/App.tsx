import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { useCart } from './contexts/CartContext';
import './App.css';
import Menu from './pages/Menu';
import MenuManagement from './pages/MenuManagement';
import Home from './pages/Home';
import TableManagement from './pages/TableManagement';

import Cart from './pages/Cart';
import KitchenOrder from './pages/KitchenOrder';
import Payment from './pages/Payment';
import { Suspense } from 'react';

const Header = () => {
  const { totalItems } = useCart();
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            <Link to="/" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Home</Link>
            <Link to="/menu" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Menu</Link>
            <Link to="/table-management" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Tables</Link>
            <Link to="/kitchen" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Kitchen</Link>
            <Link to="/online-order" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Order Online</Link>
            <Link to="/management" className="inline-flex h-11 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105">Menu Management</Link>
          </div>
          <Link 
            to="/cart" 
            className="inline-flex h-11 items-center justify-center rounded-full border border-orange-500 bg-gradient-to-r from-orange-400 to-orange-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105"
          >
            Cart {totalItems > 0 && <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <CartProvider>
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
                <Route path="/kitchen" element={<KitchenOrder />} />
                <Route path="/payment/:orderId" element={<Payment />} />
                <Route path="/management" element={<MenuManagement />} />
                <Route path="/online-order" element={<Navigate to="/menu" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
