import React from 'react';
import { TrendingUp } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
        SmartTrade
      </span>
    </div>
  );
};

export default Logo;
