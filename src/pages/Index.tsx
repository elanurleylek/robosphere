
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedCourses from '@/components/FeaturedCourses';
import NewsSection from '@/components/NewsSection';
import EventsCalendar from '@/components/EventsCalendar';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (
        anchor && 
        anchor.getAttribute('href')?.startsWith('#') && 
        anchor.getAttribute('href')?.length > 1
      ) {
        e.preventDefault();
        const id = anchor.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 100, // Offset for the fixed header
            behavior: 'smooth'
          });
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
        <FeaturedCourses />
        <NewsSection />
        <EventsCalendar />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
