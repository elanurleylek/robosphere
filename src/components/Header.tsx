// src/components/Header.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, BookOpen, Calendar, MessageSquare, LayoutDashboard, Folder, User as UserIcon, LogOut, Settings,
  FlaskConical // <-- 1. Lab İkonunu Import Et
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  // AvatarImage,
} from "@/components/ui/avatar";


const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  // === Menü Öğeleri Dizisi ===
  const menuItems = [
    { label: 'Kurslar', href: '/courses', icon: BookOpen },
    { label: 'Projeler', href: '/projects', icon: Folder },
    { label: 'Blog', href: '/blog', icon: MessageSquare },
   
    { label: 'Lab', href: '/lab', icon: FlaskConical }, // <-- 2. Lab Linkini Buraya Ekle
  ];
  // ==========================

  // Çıkış yapma
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Avatar için baş harfler
  const getInitials = (name: string) => {
      if (!name) return '?';
      const names = name.trim().split(' ');
      if (names.length === 1) return names[0][0]?.toUpperCase() || '?';
      return (names[0][0]?.toUpperCase() || '') + (names[names.length - 1][0]?.toUpperCase() || '');
  }

  return (
    // Header: Alt çizgi, sabit yükseklik, dikey hizalama
    <header className="bg-background shadow-sm sticky top-0 z-50 border-b h-16 flex items-center">
      {/* Container: Yatay padding */}
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between w-full">

        {/* Sol Taraf: Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold flex items-center space-x-2 shrink-0 mr-6"> {/* Logoya sağ boşluk */}
            <Logo downloadable={false} size="sm" />
          </Link>
        </div>


        {/* Orta ve Sağ Taraf (Desktop) */}
        <div className="hidden md:flex items-center justify-end flex-grow space-x-4">
            {/* Ana Menü Linkleri */}
            <nav className="flex items-center space-x-5">
              {/* menuItems dizisi map edildiği için Lab linki otomatik olarak buraya gelecek */}
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  // Stil: Daha soluk renk, hover'da ana renk, ikonlu
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-1.5"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Dikey Ayırıcı */}
            <div className="h-6 w-px bg-border mx-3"></div>

            {/* Kullanıcı/Auth Bölümü */}
            <div className="flex items-center space-x-3">
              {userInfo ? (
                // Giriş Yapılmışsa: Avatar ve Dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* Avatar Butonu: Hafif hover efekti */}
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-accent">
                      <Avatar className="h-9 w-9 border"> {/* Hafif border */}
                        {/* <AvatarImage src="/avatars/01.png" alt={userInfo.name} /> */}
                        <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userInfo.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userInfo.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(`/profile/${userInfo._id}`)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profilim</span>
                    </DropdownMenuItem>
                    {userInfo.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Paneli</span>
                      </DropdownMenuItem>
                    )}
                    {/* Ayarlar/Profil linki eklenebilir */}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Giriş Yapılmamışsa: Butonlar
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Giriş Yap</Button> {/* Outline yerine ghost */}
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Kayıt Ol</Button>
                  </Link>
                </>
              )}
            </div>
        </div>


        {/* Mobile Menu Button (Sağda) */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        // Stil: Daha belirgin arka plan, tam genişlik, gölge
        <div className="md:hidden absolute top-full left-0 right-0 bg-background py-5 px-6 border-t border-b shadow-lg">
          <nav className="flex flex-col space-y-3">
            {/* menuItems dizisi map edildiği için Lab linki otomatik olarak buraya gelecek */}
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                // Stil: Daha büyük font, merkezde ikon
                className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                 <item.icon className="h-5 w-5" />
                 <span>{item.label}</span>
              </Link>
            ))}
            <hr className="my-3 border-border/50"/>
            {userInfo ? (
              <>
                {/* Profil Bilgisi (isteğe bağlı) */}
                 <div className="flex items-center space-x-3 px-2 py-2 border rounded-md bg-muted/50">
                     <Avatar className="h-8 w-8">
                         <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                     </Avatar>
                     <div className='text-sm'>
                         <div className="font-medium">{userInfo.name}</div>
                         <div className="text-xs text-muted-foreground">{userInfo.email}</div>
                     </div>
                 </div>
                {/* Mobil Profilim Linki */}
                 <Link
                    to={`/profile/${userInfo._id}`}
                    className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     <UserIcon className="h-5 w-5" />
                     <span>Profilim</span>
                  </Link>

                {userInfo.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block">
                     <Button variant="ghost" className="w-full justify-start text-base py-2.5 flex items-center space-x-2"> {/* justify-start ve ikon eklendi */}
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Admin Paneli</span>
                    </Button>
                  </Link>
                )}
                <Button variant="destructive" className="w-full text-base py-2.5 flex items-center justify-center space-x-2" onClick={handleLogout}> {/* İkon eklendi */}
                  <LogOut className="h-5 w-5" />
                  <span>Çıkış Yap</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button variant="outline" className="w-full text-base py-2.5">Giriş Yap</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button className="w-full text-base py-2.5">Kayıt Ol</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;