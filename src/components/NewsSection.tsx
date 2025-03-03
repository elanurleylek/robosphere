
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Calendar } from 'lucide-react';

interface NewsItemProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
}

const NewsSection: React.FC = () => {
  const newsItems: NewsItemProps[] = [
    {
      title: "Türkiye Robotik Yarışmaları 2023 Kayıtları Başladı",
      excerpt: "MEB tarafından düzenlenen ulusal robotik yarışmalarının kayıtları açıldı. Bu yıl 10 farklı kategoride yarışmalar düzenlenecek.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      date: "12 Haziran 2023",
      category: "Yarışma",
      featured: true
    },
    {
      title: "Yapay Zeka Destekli Robotik Sistemlerin Yükselişi",
      excerpt: "Yapay zeka teknolojilerinin robotik sistemlere entegrasyonu ile ortaya çıkan yeni nesil otonom robotlar.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      date: "5 Haziran 2023",
      category: "Teknoloji"
    },
    {
      title: "Robotik Eğitim Seti Dağıtım Programı",
      excerpt: "Milli Eğitim Bakanlığı, 1000 okula robotik eğitim seti dağıtım programını başlattı.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      date: "1 Haziran 2023",
      category: "Eğitim"
    }
  ];

  return (
    <section id="news" className="py-20 px-6 bg-secondary/50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[50%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 animate-fade-up">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Robotik Dünyasından Haberler</h2>
            <p className="text-lg text-foreground/70 max-w-2xl text-balance">
              Robotik alanındaki en son gelişmeleri, etkinlikleri ve teknolojik yenilikleri takip edin.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex mt-4 md:mt-0 md:mb-1 group">
            Tüm Haberler
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <NewsCard 
              key={index} 
              {...item} 
              className={cn(
                "animate-fade-up",
                { "md:col-span-2": item.featured && index === 0 }
              )}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            />
          ))}
        </div>
        
        {/* Mobile view button */}
        <div className="mt-10 text-center md:hidden animate-fade-up">
          <Button variant="outline" className="group">
            Tüm Haberler
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// News card component
const NewsCard: React.FC<NewsItemProps & { className?: string; style?: React.CSSProperties }> = ({
  title,
  excerpt,
  image,
  date,
  category,
  featured,
  className,
  style
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden bg-card hover-lift",
        "border border-border/50 shadow-sm",
        className
      )}
      style={style}
    >
      <div className={cn(
        "grid h-full",
        featured ? "md:grid-cols-2" : "grid-cols-1"
      )}>
        {/* Card image */}
        <div className={cn(
          "overflow-hidden",
          featured ? "h-full" : "h-48"
        )}>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>
        
        {/* Card content */}
        <div className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
              {category}
            </span>
            <div className="flex items-center text-foreground/60 text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {date}
            </div>
          </div>
          
          <h3 className={cn(
            "font-semibold mb-2 text-balance",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}>
            {title}
          </h3>
          
          <p className="text-foreground/70 text-sm mb-4 flex-grow text-balance">
            {excerpt}
          </p>
          
          <Button variant="ghost" className="px-0 w-fit text-primary hover:text-primary/90 hover:bg-transparent mt-auto group">
            Devamını Oku
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
