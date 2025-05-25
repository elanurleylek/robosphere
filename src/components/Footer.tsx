// src/components/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // Link bileşeni için import edildi
import { Bot, Github, Instagram, Twitter, Youtube } from 'lucide-react'; // Cpu yerine Bot ikonu kullanıldı

const Footer: React.FC = () => {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* lg:grid-cols-3 olarak güncellendi (4. sütun kaldırıldığı için) */}
          {/* Column 1: Logo and Description */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Bot className="mr-2 h-6 w-6 text-primary" /> {/* Bot ikonu ve proje adı */}
              Robosphere
            </h4>
            <p className="text-sm text-foreground/70 mb-4">
              Robosphere, robotik ve yapay zeka meraklılarını bir araya getiren bir platformdur. Bilgi paylaşın, projeler oluşturun ve birlikte öğrenin.
            </p>
            <div className="flex space-x-4">
              {/* Sosyal medya linkleri - Kendi linklerinizle güncelleyin */}
              <a href="https://github.com/robosphere-project" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/robosphere-project" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/robosphere-project" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/robosphere-project" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links - Yeni görsele göre güncellendi */}
          <div>
            <h6 className="text-md font-semibold mb-4">Hızlı Bağlantılar</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link to="/courses" className="hover:text-primary transition-colors">Kurslar</Link>
              </li>
              <li className="mb-2">
                <Link to="/projects" className="hover:text-primary transition-colors">Projeler</Link> {/* Yeni Eklendi */}
              </li>
              <li className="mb-2">
                <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/lab" className="hover:text-primary transition-colors">Lab</Link> {/* Yeni Eklendi */}
              </li>
            </ul>
          </div>

          {/* Column 3: Courses (Popüler Kurslar) - Bu bölüm değiştirilmeden bırakıldı */}
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

          {/* Bülten Kayıt Bölümü önceki adımda tamamen kaldırıldığı için burada yer almıyor */}
        </div>

        {/* Copyright Section */}
        <div className="mt-12 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} Robosphere. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;