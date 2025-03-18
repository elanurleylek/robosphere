
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, MapPin, Clock, Users, Share2, 
  Download, ChevronRight, CalendarPlus
} from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams();
  
  // Örnek etkinlik verisi (gerçek uygulamada API'den gelecek)
  const event = {
    id: id || '1',
    title: 'Robotik Kodlama Yarışması',
    date: '24 Temmuz 2023',
    time: '10:00 - 17:00',
    location: 'İstanbul Teknik Üniversitesi, Maslak Kampüsü',
    attendees: 250,
    organizer: 'Robotik Okulu & ITÜ Robotik Kulübü',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    description: `Bu yarışma, öğrencilerin robotik kodlama becerilerini sergileyebilecekleri ulusal çapta bir etkinliktir. Katılımcılar, belirli görevleri yerine getirecek robotlar programlayacak ve jüri tarafından değerlendirilecektir.

Yarışma, farklı yaş kategorilerinde gerçekleştirilecek olup, kazananlara çeşitli ödüller verilecektir. Etkinlik aynı zamanda robotik alanında önde gelen şirketlerin ve üniversitelerin katılımıyla bir kariyer fuarı da içerecektir.

Etkinliğe katılmak için önceden kayıt yaptırmanız gerekmektedir. Kontenjan sınırlıdır.`,
    schedule: [
      { time: '09:00 - 10:00', activity: 'Kayıt ve Karşılama' },
      { time: '10:00 - 10:30', activity: 'Açılış Konuşmaları' },
      { time: '10:30 - 12:30', activity: 'İlk Tur Yarışmalar' },
      { time: '12:30 - 13:30', activity: 'Öğle Yemeği' },
      { time: '13:30 - 15:30', activity: 'İkinci Tur Yarışmalar' },
      { time: '15:30 - 16:00', activity: 'Ara' },
      { time: '16:00 - 17:00', activity: 'Final Yarışmaları ve Ödül Töreni' }
    ],
    speakers: [
      { name: 'Prof. Dr. Ahmet Yılmaz', title: 'ITÜ Bilgisayar Mühendisliği', topic: 'Robotik Teknolojilerinin Geleceği' },
      { name: 'Dr. Ayşe Kaya', title: 'Robotik Okulu Direktörü', topic: 'Eğitimde Robotik Uygulamaları' },
      { name: 'Mehmet Demir', title: 'XYZ Robotics CEO', topic: 'Endüstriyel Robotik Çözümler' }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Event Image */}
              <div className="md:w-1/2">
                <div className="rounded-xl overflow-hidden h-[300px] md:h-[400px]">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Event Info */}
              <div className="md:w-1/2 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                
                <div className="flex flex-col space-y-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <span>{event.attendees} Katılımcı</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Button className="flex-1" size="lg">Etkinliğe Kayıt Ol</Button>
                  <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Takvime Ekle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Event Details */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Etkinlik Hakkında</h2>
                    <div className="whitespace-pre-line text-foreground/80 mb-8">
                      {event.description}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Program Akışı</h3>
                    <div className="space-y-4 mb-8">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex border-l-2 border-primary/30 pl-4">
                          <div className="w-32 font-medium">{item.time}</div>
                          <div>{item.activity}</div>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Konuşmacılar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.speakers.map((speaker, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold">{speaker.name}</h4>
                            <p className="text-sm text-foreground/70 mb-2">{speaker.title}</p>
                            <p className="text-sm">
                              <span className="font-medium">Konu:</span> {speaker.topic}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Etkinlik Bilgileri</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-foreground/70">Organizatör</div>
                        <div className="font-medium">{event.organizer}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-foreground/70">Kontenjan</div>
                        <div className="font-medium">
                          <span className="text-primary font-bold">{event.attendees}</span> / 300 kişi
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-foreground/70">Kategori</div>
                        <div className="font-medium">Yarışma, Eğitim</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-foreground/70">Etiketler</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Robotik</span>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Kodlama</span>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Yarışma</span>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Gençler</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Konum</h3>
                    
                    <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4">
                      {/* Burada gerçek bir harita entegrasyonu olabilir */}
                      <div className="w-full h-full flex items-center justify-center bg-muted/50">
                        <MapPin className="h-10 w-10 text-primary/30" />
                      </div>
                    </div>
                    
                    <p className="text-foreground/80 mb-2">{event.location}</p>
                    <Button variant="outline" className="w-full" size="sm">
                      Yol Tarifi Al
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Etkinlik Dökümanları</h3>
                    
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Yarışma Şartnamesi
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Katılımcı Kılavuzu
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Events */}
        <section className="py-12 bg-muted/30">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Benzer Etkinlikler</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" 
                      alt="Etkinlik" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-foreground/70 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {i === 1 ? '15 Ağustos 2023' : 
                         i === 2 ? '22 Ağustos 2023' : 
                         '5 Eylül 2023'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">
                      {i === 1 ? 'Robotik Yaz Kampı' : 
                       i === 2 ? 'Yapay Zeka Workshop' : 
                       'Drone Yarışması'}
                    </h3>
                    
                    <div className="flex items-center text-sm text-foreground/70 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {i === 1 ? 'Ankara, ODTÜ Kampüsü' : 
                         i === 2 ? 'İstanbul, Boğaziçi Üniversitesi' : 
                         'İzmir, Ege Üniversitesi'}
                      </span>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2">Detaylar</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetail;
