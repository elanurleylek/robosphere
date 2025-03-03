
import React from 'react';
import { cn } from '@/lib/utils';

interface TabSwitcherProps {
  activeTab: 'upcoming' | 'featured';
  setActiveTab: (tab: 'upcoming' | 'featured') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="inline-flex rounded-md shadow-sm">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-l-md",
            activeTab === 'upcoming' 
              ? "bg-primary text-white" 
              : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          Yaklaşan Etkinlikler
        </button>
        <button
          onClick={() => setActiveTab('featured')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-r-md",
            activeTab === 'featured' 
              ? "bg-primary text-white" 
              : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          Öne Çıkan Etkinlikler
        </button>
      </div>
    </div>
  );
};

export default TabSwitcher;
