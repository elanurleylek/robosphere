
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import EventCard from './events/EventCard';
import TabSwitcher from './events/TabSwitcher';
import { eventsList } from '@/data/events';

const EventsCalendar: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'featured'>('upcoming');
  
  // Filter events based on active tab
  const filteredEvents = activeTab === 'featured' 
    ? eventsList.filter(event => event.featured) 
    : eventsList;

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
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        
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

export default EventsCalendar;
