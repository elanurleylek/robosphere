
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin, Users, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventProps {
  title: string;
  date: string;
  location: string;
  type: 'Yarışma' | 'Konferans' | 'Workshop';
  image?: string;
  attendees?: number;
  featured?: boolean;
}

const EventsCalendar: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'featured'>('upcoming');
  
  // Events data
  const events: EventProps[] = [
    {
      title: "Uluslararası Robotik Konferansı 2023",
      date: "15-17 Temmuz 2023",
      location: "İstanbul",
      type: "Konferans",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      attendees: 1200,
      featured: true
    },
    {
      title: "MEB Robot Yarışması",
      date: "24-26 Ağustos 2023",
      location: "Ankara",
      type: "Yarışma",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      attendees: 500
    },
    {
      title: "Arduino ile Robotik Workshop",
      date: "5 Temmuz 2023",
      location: "İzmir",
      type: "Workshop",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      attendees: 50
    },
    {
      title: "Otonom Robotlar Hackathon",
      date: "12-13 Temmuz 2023",
      location: "Online",
      type: "Yarışma",
      attendees: 300
    }
  ];
  
  // Filter events based on active tab
  const filteredEvents = activeTab === 'featured' 
    ? events.filter(event => event.featured) 
    : events;

  return (
    <section id="events" className="py-20 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[40%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Yaklaşan Etkinlikler ve Yarışmalar</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            Robotik alanındaki konferanslar, yarışmalar ve workshopları takip edin, topluluğa katılın.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-l-md",
                activeTab === 'upcoming' 
                  ? "bg-primary text-white" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              Yaklaşan Etkinlikler
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-r-md",
                activeTab === 'featured' 
                  ? "bg-primary text-white" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              Öne Çıkan Etkinlikler
            </button>
          </div>
        </div>
        
        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <EventCard 
              key={index} 
              {...event} 
              className="animate-fade-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            />
          ))}
        </div>
        
        {/* Action button */}
        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 group">
            Tüm Etkinlikleri Görüntüle
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Event card component
const EventCard: React.FC<EventProps & { className?: string; style?: React.CSSProperties }> = ({
  title,
  date,
  location,
  type,
  image,
  attendees,
  featured,
  className,
  style
}) => {
  // Type to color mapping
  const typeColors = {
    'Yarışma': 'bg-yellow-100 text-yellow-800',
    'Konferans': 'bg-blue-100 text-blue-800',
    'Workshop': 'bg-green-100 text-green-800'
  };
  
  const hasImage = !!image;
  
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden bg-card hover-lift",
        "border border-border/50 shadow-sm",
        className
      )}
      style={style}
    >
      {/* Card image (if available) */}
      {hasImage && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Card content */}
      <div className={cn(
        "p-6",
        !hasImage && "pt-8"
      )}>
        <div className="flex items-start justify-between mb-4">
          <span className={cn(
            "px-2.5 py-0.5 rounded text-xs font-medium",
            typeColors[type]
          )}>
            {type}
          </span>
          
          {featured && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
              Öne Çıkan
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-foreground/70">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center text-foreground/70">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{location}</span>
          </div>
          
          {attendees && (
            <div className="flex items-center text-foreground/70">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">{attendees} Katılımcı</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="text-primary border-primary/30">
            Detaylar
          </Button>
          
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
            Kayıt Ol
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
