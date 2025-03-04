
import React from 'react';
import Header from '@/components/Header';
import EventsCalendar from '@/components/EventsCalendar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, MapPin, Users, Search } from 'lucide-react';

const upcomingHighlights = [
  {
    title: "Robotik Yarışması Finali",
    date: "24 Temmuz 2023",
    location: "İstanbul",
    attendees: 500,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Yapay Zeka Konferansı",
    date: "3 Ağustos 2023",
    location: "Ankara",
    attendees: 300,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  }
];

const Events: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24 relative">
          <div className="container px-6 mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Robotik Etkinlikleri</h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
              Yarışmalar, konferanslar ve workshoplarla robotik dünyasındaki son gelişmeleri takip edin.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto flex gap-2 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  placeholder="Etkinlik ara..." 
                  className="pl-10 h-12"
                />
              </div>
              <Button>Ara</Button>
            </div>
          </div>
          
          {/* Background blur elements */}
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
        </section>
        
        {/* Highlighted Events */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Öne Çıkan Etkinlikler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingHighlights.map((event, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div className="flex flex-col space-y-2 text-foreground/70 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendees} katılımcı</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group">
                      Detayları Görüntüle
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Events Calendar */}
        <EventsCalendar />
        
        {/* Call to Action */}
        <section className="py-16 bg-primary/5">
          <div className="container px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Etkinlik mi Düzenlemek İstiyorsunuz?</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Robotik okulu etkinlik alanlarında workshoplar, yarışmalar ve konferanslar düzenleyebilirsiniz.
            </p>
            <Button size="lg" className="group">
              Etkinlik Başvurusu
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
