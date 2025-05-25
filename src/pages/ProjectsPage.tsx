// src/pages/ProjectsPage.tsx

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/sections/ProjectsSection';

const ProjectsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;