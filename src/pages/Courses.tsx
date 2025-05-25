// src/pages/Courses.tsx

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoursesSection from '@/components/sections/CoursesSection';

const Courses: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
         <CoursesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Courses;