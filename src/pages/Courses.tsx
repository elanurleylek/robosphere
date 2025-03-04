
import React from 'react';
import Header from '@/components/Header';
import FeaturedCourses from '@/components/FeaturedCourses';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, Filter, Cpu, CircuitBoard, Microchip, Cog } from 'lucide-react';

const courseCategories = [
  { name: 'Robotik Temel', count: 12, icon: Cpu },
  { name: 'Arduino', count: 8, icon: CircuitBoard },
  { name: 'Raspberry Pi', count: 6, icon: Microchip }, 
  { name: 'Sensörler', count: 9, icon: Cog },
];

const Courses: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-6 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Robotik Eğitim Kursları</h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
              Her seviyeye uygun, uygulamalı robotik eğitimlerimizle geleceğin teknolojilerini keşfedin.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-2 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  placeholder="Kurs ara..." 
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrele
              </Button>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-12 bg-background/50">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Kurs Kategorileri</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {courseCategories.map((category) => (
                <div 
                  key={category.name}
                  className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <category.icon className="h-5 w-5" />
                    </div>
                    <span className="text-foreground/70 text-sm">{category.count} kurs</span>
                  </div>
                  <h3 className="font-medium text-lg mt-4">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Courses */}
        <FeaturedCourses />
        
        {/* Call to Action */}
        <section className="py-16 bg-primary/5">
          <div className="container px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Hayalinizdeki Robotiğe Başlayın</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Uygulamalı eğitimlerimizle robotik alanında bilgi ve becerilerinizi geliştirin.
            </p>
            <Button size="lg" className="group">
              Hemen Kayıt Ol
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
