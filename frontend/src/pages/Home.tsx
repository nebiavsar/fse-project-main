import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const isLoggedIn = localStorage.getItem('customerId') !== null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-6xl font-bold tracking-tighter animate-fade-up">
          Welcome to Our Restaurant
        </h1>
        
        <p className="text-xl text-muted-foreground mt-4 animate-fade-up animation-delay-200">
          Experience the finest dining with our carefully crafted menu and exceptional service
        </p>
        
        <div className="flex gap-4 justify-center mt-8 animate-fade-up animation-delay-400">
          <Link 
            to="/menu" 
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View Menu
          </Link>
        </div>

        {!isLoggedIn && (
          <div className="mt-12 animate-fade-up animation-delay-600">
            <p className="text-muted-foreground mb-4">Don't you have an account?</p>
            <Link
              to="/sign-in"
              className="inline-flex h-11 items-center justify-center rounded-md border border-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105"
            >
              Create one now!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
