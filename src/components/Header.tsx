
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, Cpu, 
  BookOpen, Calendar, MessageSquare, ShoppingBag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Kurslar', href: '#courses', icon: BookOpen },
    { label: 'Etkinlikler', href: '#events', icon: Calendar },
    { label: 'Blog', href: '#blog', icon: MessageSquare },
    { label: 'Mağaza', href: '#shop', icon: ShoppingBag },
  ];

  return (
    <header className="bg-background py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold flex items-center space-x-2">
          <Cpu className="h-6 w-6 text-primary" />
          <span>Robotik Okulu</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <a key={item.label} href={item.href} className="hover:text-primary transition-colors duration-200 flex items-center space-x-1">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </a>
          ))}
          <Link to="/login">
            <Button variant="outline">Giriş Yap</Button>
          </Link>
          <Link to="/register">
            <Button>Kayıt Ol</Button>
          </Link>
        </nav>

        {/* Mobile Navigation Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary/10 backdrop-blur-sm py-4 px-6">
          <nav className="flex flex-col space-y-3">
            {navigationItems.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-primary transition-colors duration-200 block">
                {item.label}
              </a>
            ))}
            <Link to="/login">
              <Button variant="outline" className="w-full">Giriş Yap</Button>
            </Link>
            <Link to="/register">
              <Button className="w-full">Kayıt Ol</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
