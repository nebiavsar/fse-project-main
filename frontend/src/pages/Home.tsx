import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
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
          <Link
            to="/management"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
