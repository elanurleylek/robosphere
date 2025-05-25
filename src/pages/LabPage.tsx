// src/pages/LabPage.tsx

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LabSection from '@/components/sections/LabSection';

const LabPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
         <LabSection />
      </main>
      <Footer />
    </div>
  );
};

export default LabPage;