// src/pages/Index.tsx
'use client';

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

import CoursesSection from '@/components/sections/CoursesSection';
import BlogSection from '@/components/sections/BlogSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import LabSection from '@/components/sections/LabSection';

const Index: React.FC = () => {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
          anchor &&
          anchor.getAttribute('href')?.startsWith('#') &&
          anchor.getAttribute('href')?.length > 1 &&
          (anchor.pathname === window.location.pathname || anchor.pathname === "")
        ) {
          e.preventDefault();
          const id = anchor.getAttribute('href')?.substring(1);
          const element = document.getElementById(id || '');

          if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else {
             console.warn(`Smooth scroll target element with ID '${id}' not found on homepage.`);
          }
        }
      };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);

  }, []);


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />

         <div className="container mx-auto px-6 py-8 text-center">
             <h2 className="text-3xl font-bold text-foreground">Robotik Eğitim Kursları</h2>
             <p className="text-muted-foreground max-w-xl mx-auto mt-2">Uzman eğitmenlerimizden dersler alın.</p>
         </div>
        <CoursesSection />

         <div className="container mx-auto px-6 py-8 text-center">
             <h2 className="text-3xl font-bold text-foreground">Son Yazılarımız</h2>
             <p className="text-muted-foreground max-w-xl mx-auto mt-2">Robotik ve teknoloji dünyasından güncel haberler.</p>
         </div>
        <BlogSection />

         <div className="container mx-auto px-6 py-8 text-center">
             <h2 className="text-3xl font-bold text-foreground">Projelerimizi Keşfedin</h2>
             <p className="text-muted-foreground max-w-xl mx-auto mt-2">Öğrencilerimizin başarı hikayeleri.</p>
         </div>
        <ProjectsSection />

         <div className="container mx-auto px-6 py-8 text-center">
             <h2 className="text-3xl font-bold text-foreground">Sanal Lab Ortamı</h2>
             <p className="text-muted-foreground max-w-xl mx-auto mt-2">Kendi robot deneylerinizi yapın.</p>
         </div>
        <LabSection />

      </main>

      <Footer />
    </div>
  );
};

export default Index;