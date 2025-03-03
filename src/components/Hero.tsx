
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Book, Video, Trophy, CircuitBoard } from 'lucide-react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroContent = heroRef.current.querySelector('.hero-content');
      const heroImage = heroRef.current.querySelector('.hero-image');
      
      if (heroContent instanceof HTMLElement) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
      
      if (heroImage instanceof HTMLElement) {
        heroImage.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Features data
  const features = [
    { icon: <Book className="h-5 w-5 text-primary" />, text: "Kapsamlı Eğitim" },
    { icon: <Video className="h-5 w-5 text-primary" />, text: "Video Dersler" },
    { icon: <Trophy className="h-5 w-5 text-primary" />, text: "Yarışmalar" },
    { icon: <CircuitBoard className="h-5 w-5 text-primary" />, text: "Projeler" }
  ];
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-10 px-6"
    >
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[70%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Hero content */}
        <div className="hero-content flex flex-col space-y-8 md:pr-8">
          <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Türkiye'nin En Kapsamlı Robotik Platformu
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Robotik Dünyasını Keşfet
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-xl py-4 text-balance">
              Eğitim içerikleri, projeler, yarışmalar ve daha fazlası ile robotik alanında kendini geliştir.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 transition-colors group">
              Ücretsiz Başla
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Daha Fazla Bilgi
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 text-sm font-medium"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hero image */}
        <div className="hero-image relative order-first md:order-last animate-fade-in">
          <div className={cn(
            "relative z-10 rounded-2xl overflow-hidden shadow-2xl",
            "before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/20 before:z-10"
          )}>
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" 
              alt="Robot" 
              className="w-full aspect-square md:aspect-auto md:h-[500px] object-cover"
              loading="lazy"
            />
            
            {/* Image overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <div className="glass-card rounded-xl p-4">
                <h3 className="font-semibold text-foreground">Başlangıç Robotik Projelerinizi Keşfedin</h3>
                <p className="text-sm text-foreground/80 mt-1">Arduino, Raspberry Pi ve daha fazlası</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 w-24 h-24 rounded-full bg-primary/20 blur-2xl"></div>
          <div className="absolute -bottom-6 left-1/4 transform -translate-x-1/2 w-32 h-32 rounded-full bg-primary/10 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
