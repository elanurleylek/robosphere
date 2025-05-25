// src/pages/Blog.tsx

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogSection from '@/components/sections/BlogSection';

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;