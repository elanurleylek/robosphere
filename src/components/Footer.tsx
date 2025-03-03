import React from 'react';
import { Button } from '@/components/ui/button';
import { Cpu, Github, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and Description */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Cpu className="mr-2 h-6 w-6 text-primary" />
              Lovable
            </h4>
            <p className="text-sm text-foreground/70 mb-4">
              Lovable is a platform for creating and sharing AI-powered applications.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h6 className="text-md font-semibold mb-4">Hızlı Bağlantılar</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <a href="#" className="hover:text-primary transition-colors">Anasayfa</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-primary transition-colors">Kurslar</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-primary transition-colors">Etkinlikler</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-primary transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">İletişim</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses */}
          <div>
            <h6 className="text-md font-semibold mb-4">Popüler Kurslar</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <a href="#" className="hover:text-primary transition-colors">Robotik Temelleri</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-primary transition-colors">Arduino ile Robot Kontrolü</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-primary transition-colors">Yapay Zeka ve Robotik</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">ROS ile Robot Programlama</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div>
            <h6 className="text-md font-semibold mb-4">Bültene Kayıt Ol</h6>
            <p className="text-sm text-foreground/70 mb-4">
              En son robotik haberleri ve kursları kaçırmayın!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-secondary rounded-l-md px-4 py-2 text-sm focus:outline-none w-full"
              />
              <Button className="rounded-l-none bg-primary hover:bg-primary/90 text-sm">
                Abone Ol
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} Lovable. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
