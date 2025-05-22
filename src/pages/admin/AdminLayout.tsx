import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, Calendar, 
  LogOut, Menu, X, ArrowLeft, Cpu, Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Kurslar', href: '/admin/courses', icon: BookOpen },
    { label: 'Projeler', href: '/admin/projects', icon: Folder },
    { label: 'Etkinlikler', href: '/admin/events', icon: Calendar },
    { label: 'Kullanıcılar', href: '/admin/users', icon: Users },
  ];
  
  const handleLogout = () => {
    toast.success('Başarıyla çıkış yapıldı');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin header */}
      <header className="bg-primary text-primary-foreground shadow-md h-16 flex items-center px-4 justify-between z-20">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-primary-foreground"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div className="flex items-center space-x-2">
            <Cpu className="h-6 w-6" />
            <span className="font-semibold text-lg">Robotik Okulu Admin</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-primary-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Siteye Dön
          </Button>
          <Button 
            variant="outline" 
            className="bg-primary-foreground text-primary"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-card border-r border-border transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-0'
          } overflow-y-auto`}
        >
          <div className="flex flex-col p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
