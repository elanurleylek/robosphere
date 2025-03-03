
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EventProps {
  title: string;
  date: string;
  location: string;
  type: 'Yarışma' | 'Konferans' | 'Workshop';
  image?: string;
  attendees?: number;
  featured?: boolean;
}

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

export default EventCard;
