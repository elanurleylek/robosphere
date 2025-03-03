
import React from 'react';
import { Circuit, Youtube, Twitter, Facebook, Instagram, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Footer links
  const footerLinks = [
    {
      title: "Platformumuz",
      links: [
        { label: "Hakkımızda", href: "#" },
        { label: "İletişim", href: "#" },
        { label: "Kariyer", href: "#" },
        { label: "Blog", href: "#" },
        { label: "SSS", href: "#" }
      ]
    },
    {
      title: "Eğitimler",
      links: [
        { label: "Arduino", href: "#" },
        { label: "Raspberry Pi", href: "#" },
        { label: "Sensörler", href: "#" },
        { label: "Robotik Kodlama", href: "#" },
        { label: "Yapay Zeka", href: "#" }
      ]
    },
    {
      title: "Topluluk",
      links: [
        { label: "Forum", href: "#" },
        { label: "Proje Paylaşımları", href: "#" },
        { label: "Etkinlikler", href: "#" },
        { label: "Yarışmalar", href: "#" },
        { label: "Sponsor Ol", href: "#" }
      ]
    }
  ];
  
  // Social links
  const socialLinks = [
    { icon: <Youtube size={18} />, label: "Youtube", href: "#" },
    { icon: <Twitter size={18} />, label: "Twitter", href: "#" },
    { icon: <Facebook size={18} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={18} />, label: "Instagram", href: "#" },
    { icon: <Github size={18} />, label: "Github", href: "#" },
    { icon: <Linkedin size={18} />, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-secondary/30 pt-16 pb-8 px-6 relative overflow-hidden">
      {/* Abstract background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute -top-[30%] -left-[10%] w-[40%] h-[50%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[40%] h-[50%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-20 mb-16">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <Circuit className="w-8 h-8 text-primary" />
              <span className="text-2xl font-semibold">Robotik</span>
            </div>
            
            <p className="text-foreground/70 mt-4 mb-6 text-balance">
              Robotik eğitimi, projeler, haberler ve daha fazlasıyla Türkiye'nin en kapsamlı robotik platformu.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Bültenimize Abone Olun</h4>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input 
                  type="email" 
                  placeholder="Email adresiniz" 
                  className="border-border/60 focus:border-primary" 
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Footer links */}
          {footerLinks.map((section, i) => (
            <div key={i} className="lg:col-span-1">
              <h4 className="font-medium text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a 
                      href={link.href} 
                      className="text-foreground/70 hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Social links */}
          <div className="lg:col-span-1">
            <h4 className="font-medium text-lg mb-4">Bizi Takip Edin</h4>
            <div className="grid grid-cols-3 gap-3">
              {socialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  className="flex items-center justify-center p-2 rounded-full hover:bg-primary/10 text-foreground/70 hover:text-primary transition-colors duration-200"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/70">
          <div>
            &copy; {currentYear} Robotik. Tüm hakları saklıdır.
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a href="#" className="hover:text-foreground transition-colors duration-200">Gizlilik Politikası</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Kullanım Şartları</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
