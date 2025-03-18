
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Calendar, BookOpen, Award, CheckCircle, User, ArrowRight } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  
  // Örnek kurs verisi (gerçek uygulamada API'den gelecek)
  const course = {
    id: id || '1',
    title: 'Arduino ile Robotik Programlama',
    instructor: 'Dr. Mehmet Yılmaz',
    level: 'Orta Seviye',
    duration: '8 Hafta',
    students: 124,
    rating: 4.8,
    reviews: 56,
    price: 1299.99,
    startDate: '15 Ağustos 2023',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    description: 'Bu kurs, Arduino platformunu kullanarak robotik projeleri geliştirmeyi öğrenmek isteyenler için tasarlanmıştır. Sensörler, motorlar ve diğer elektronik bileşenleri kullanarak kendi robotlarınızı programlamayı öğreneceksiniz.',
    objectives: [
      'Arduino platformunu etkili bir şekilde kullanabilmek',
      'Temel elektronik devreleri kurabilmek',
      'Sensörlerden veri okuyabilmek',
      'Motor kontrolü yapabilmek',
      'Kendi robotik projelerinizi geliştirebilmek',
      'Gerçek dünya problemlerini robotik çözümlerle ele alabilmek'
    ],
    contents: [
      {
        week: 'Hafta 1',
        title: 'Arduino Temelleri',
        lessons: ['Arduino IDE Kurulumu', 'İlk Programı Yazma', 'LED Kontrolü']
      },
      {
        week: 'Hafta 2',
        title: 'Sensörler ve Veri Okuma',
        lessons: ['Sıcaklık Sensörleri', 'Ultrasonik Mesafe Sensörleri', 'IR Sensörler']
      },
      {
        week: 'Hafta 3',
        title: 'Motor Kontrolü',
        lessons: ['DC Motorlar', 'Servo Motorlar', 'H-Bridge Sürücüler']
      },
      {
        week: 'Hafta 4',
        title: 'İletişim Protokolleri',
        lessons: ['I2C', 'SPI', 'UART']
      },
      {
        week: 'Hafta 5',
        title: 'Çizgi İzleyen Robot',
        lessons: ['Sensör Dizilimi', 'PID Kontrolü', 'Hız Optimizasyonu']
      },
      {
        week: 'Hafta 6',
        title: 'Engel Algılayan Robot',
        lessons: ['Ultrasonik Sensör Kullanımı', 'Karar Algoritmaları', 'Haritalama']
      },
      {
        week: 'Hafta 7',
        title: 'Bluetooth Kontrollü Robot',
        lessons: ['HC-05 Modülü', 'Android Uygulama Entegrasyonu', 'Komut Seti Tasarımı']
      },
      {
        week: 'Hafta 8',
        title: 'Final Projesi',
        lessons: ['Proje Geliştirme', 'Test ve Optimizasyon', 'Sunumlar']
      }
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
              {/* Course Image */}
              <div className="md:w-1/2">
                <div className="rounded-xl overflow-hidden h-[300px] md:h-[400px]">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Course Info */}
              <div className="md:w-1/2 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    <span>{course.level}</span>
                  </div>
                </div>
                
                <p className="text-foreground/70 mb-6">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="text-sm text-foreground/70">Süre</div>
                      <div className="font-medium">{course.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="text-sm text-foreground/70">Öğrenci</div>
                      <div className="font-medium">{course.students} kişi</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="text-sm text-foreground/70">Başlangıç</div>
                      <div className="font-medium">{course.startDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="text-sm text-foreground/70">Değerlendirme</div>
                      <div className="font-medium">{course.rating} ({course.reviews} yorum)</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto space-y-4">
                  <div className="text-3xl font-bold">{course.price.toLocaleString('tr-TR')} ₺</div>
                  <Button className="w-full" size="lg">Kursa Kayıt Ol</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Course Content */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <Tabs defaultValue="icerik" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="icerik">Kurs İçeriği</TabsTrigger>
                <TabsTrigger value="hedefler">Öğrenme Hedefleri</TabsTrigger>
                <TabsTrigger value="yorumlar">Yorumlar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="icerik" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Kurs Müfredatı</h3>
                    
                    <div className="space-y-4">
                      {course.contents.map((week, index) => (
                        <div key={index} className="border border-border rounded-lg overflow-hidden">
                          <div className="bg-muted p-4 flex justify-between items-center">
                            <div>
                              <span className="text-sm font-medium text-foreground/70">{week.week}</span>
                              <h4 className="font-medium">{week.title}</h4>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="p-4 space-y-2">
                            {week.lessons.map((lesson, i) => (
                              <div key={i} className="flex items-start">
                                <CheckCircle className="h-5 w-5 mr-3 text-primary/70" />
                                <span>{lesson}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="hedefler" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Bu Kursta Öğrenecekleriniz</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-3 shrink-0 text-primary" />
                          <span>{objective}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="yorumlar" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Öğrenci Yorumları</h3>
                      <Button variant="outline">Yorum Yap</Button>
                    </div>
                    
                    <div className="text-center py-8">
                      <p className="text-foreground/70">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Related Courses */}
        <section className="py-12 bg-muted/30">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Benzer Kurslar</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" 
                      alt="Kurs" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground/70">Robotik</span>
                      <span className="text-sm font-medium">4.5 (42)</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">
                      {i === 1 ? 'Raspberry Pi ile Akıllı Sistemler' : 
                       i === 2 ? 'Robot Kol Programlama' : 
                       'Yapay Zeka ve Robotik'}
                    </h3>
                    
                    <div className="flex items-center mt-4 mb-2">
                      <User className="h-4 w-4 mr-2 text-foreground/70" />
                      <span className="text-sm text-foreground/70">
                        {i === 1 ? 'Dr. Ayşe Kaya' : 
                         i === 2 ? 'Prof. Ali Demir' : 
                         'Doç. Zeynep Yıldız'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-bold">
                        {(999 + i * 200).toLocaleString('tr-TR')} ₺
                      </div>
                      <Button variant="outline" size="sm">Detaylar</Button>
                    </div>
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

export default CourseDetail;
