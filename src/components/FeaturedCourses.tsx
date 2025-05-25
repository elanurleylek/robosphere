import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Cpu, 
  CircuitBoard, 
  Microchip, 
  Cog 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATIC_FILES_DOMAIN } from '../lib/api';

// Course card type definition
interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  duration: string;
  icon: React.ReactNode;
  featured?: boolean;
}

const FeaturedCourses: React.FC = () => {
  // Courses data
  const courses: CourseCardProps[] = [
    {
      title: "Arduino ile Robotik Temelleri",
      description: "Arduino platformu üzerinde robotik programlamanın temellerini öğrenin.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      difficulty: "Başlangıç",
      duration: "8 Hafta",
      icon: <CircuitBoard className="h-5 w-5" />,
      featured: true
    },
    {
      title: "Raspberry Pi Projeleri",
      description: "Raspberry Pi ile akıllı ev sistemleri ve IoT projeleri geliştirin.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      difficulty: "Orta",
      duration: "10 Hafta",
      icon: <Microchip className="h-5 w-5" />
    },
    {
      title: "Sensörler ve Aktüatörler",
      description: "Robotik sistemlerde kullanılan sensör ve aktüatör teknolojilerini keşfedin.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      difficulty: "Başlangıç",
      duration: "6 Hafta",
      icon: <Cpu className="h-5 w-5" />
    },
    {
      title: "İleri Seviye Robotik Programlama",
      description: "Karmaşık robotik sistemler için ileri seviye programlama teknikleri.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      difficulty: "İleri",
      duration: "12 Hafta",
      icon: <Cog className="h-5 w-5" />
    }
  ];

  return (
    <section id="courses" className="py-20 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Öne Çıkan Robotik Eğitimleri</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            Her seviyeye uygun, uygulamalı robotik eğitimlerimizle becerilerinizi geliştirin ve projeler oluşturun.
          </p>
        </div>
        
        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard 
              key={index} 
              {...course} 
              className={cn(
                "animate-fade-up",
                { "lg:col-span-2": course.featured }
              )}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            />
          ))}
        </div>
        
        {/* Action button */}
        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <Button variant="outline" size="lg" className="group">
            Tüm Eğitimleri Keşfet
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Course card component
const CourseCard: React.FC<CourseCardProps & { className?: string; style?: React.CSSProperties }> = ({
  title,
  description,
  image,
  difficulty,
  duration,
  icon,
  featured,
  className,
  style
}) => {
  // Map difficulty to color
  const difficultyColor = {
    'Başlangıç': 'bg-green-100 text-green-800',
    'Orta': 'bg-blue-100 text-blue-800',
    'İleri': 'bg-purple-100 text-purple-800'
  }[difficulty];
  
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden bg-card hover-lift",
        "border border-border/50 shadow-sm",
        className
      )}
      style={style}
    >
      {/* Card image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            console.warn("Featured kurs resmi yüklenemedi:", (e.target as HTMLImageElement).src, "-> Varsayılan resme geçiliyor.");
            (e.target as HTMLImageElement).onerror = null; // Sonsuz döngüyü önle
            (e.target as HTMLImageElement).src = `${STATIC_FILES_DOMAIN}/default-course.png`; // Varsayılan resim URL'si
          }}
        />
        
        {/* Difficulty badge */}
        <div className={cn(
          "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium",
          difficultyColor
        )}>
          {difficulty}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
            <span className="text-sm font-medium text-foreground/70">{duration}</span>
          </div>
          
          {featured && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
              Öne Çıkan
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-foreground/70 mb-4 text-balance">{description}</p>
        
        <Button variant="ghost" className="px-0 text-primary hover:text-primary/90 hover:bg-transparent group">
          Eğitime Katıl
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturedCourses;
