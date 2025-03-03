
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Circuit, 
  GraduationCap, 
  Calendar, 
  ShoppingBag, 
  Newspaper, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out px-6 py-4',
        scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Circuit className="w-7 h-7 text-primary" />
          <span className="text-xl font-medium">Robotik</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="#courses" icon={<GraduationCap className="w-4 h-4" />} text="Eğitim" />
          <NavLink href="#news" icon={<Newspaper className="w-4 h-4" />} text="Haberler" />
          <NavLink href="#events" icon={<Calendar className="w-4 h-4" />} text="Etkinlikler" />
          <NavLink href="#shop" icon={<ShoppingBag className="w-4 h-4" />} text="Ürünler" />
        </nav>
        
        {/* Auth buttons - desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
            Giriş Yap
          </Button>
          <Button className="bg-primary/90 hover:bg-primary transition-colors duration-300">
            Kayıt Ol
          </Button>
        </div>
        
        {/* Mobile menu trigger */}
        <button 
          className="md:hidden p-2 text-foreground/80 hover:text-foreground"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile navigation */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 top-16 bg-background/98 backdrop-blur-md transition-all duration-300 ease-in-out flex flex-col z-40",
          menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col p-8 space-y-6 animate-fade-in">
          <MobileNavLink href="#courses" icon={<GraduationCap className="w-5 h-5" />} text="Eğitim" onClick={() => setMenuOpen(false)} />
          <MobileNavLink href="#news" icon={<Newspaper className="w-5 h-5" />} text="Haberler" onClick={() => setMenuOpen(false)} />
          <MobileNavLink href="#events" icon={<Calendar className="w-5 h-5" />} text="Etkinlikler" onClick={() => setMenuOpen(false)} />
          <MobileNavLink href="#shop" icon={<ShoppingBag className="w-5 h-5" />} text="Ürünler" onClick={() => setMenuOpen(false)} />
          
          <div className="pt-6 border-t border-border/50 flex flex-col space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Giriş Yap
            </Button>
            <Button className="w-full justify-start">
              Kayıt Ol
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

// Desktop Nav Link component
const NavLink: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ 
  href, 
  icon, 
  text 
}) => {
  return (
    <a 
      href={href} 
      className="group flex items-center space-x-1.5 text-foreground/80 hover:text-foreground underline-animation py-1"
    >
      {icon}
      <span className="font-medium text-sm">{text}</span>
    </a>
  );
};

// Mobile Nav Link component
const MobileNavLink: React.FC<{ 
  href: string; 
  icon: React.ReactNode; 
  text: string;
  onClick: () => void;
}> = ({ 
  href, 
  icon, 
  text,
  onClick
}) => {
  return (
    <a 
      href={href} 
      className="flex items-center space-x-3 text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-muted transition-colors duration-200"
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </a>
  );
};

export default Header;
