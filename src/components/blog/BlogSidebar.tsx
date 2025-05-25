// src/components/blog/BlogSidebar.tsx
'use client'; // Bu satırı ekliyorum, çünkü BlogSection'da da 'use client' var ve bu bileşen de client-side'da render edilecek etkileşimli elementler içeriyor.

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bookmark, Calendar } from 'lucide-react';
import BlogCategories from './BlogCategories'; // BlogCategories bileşenini kullanıyorsunuz.

interface BlogSidebarProps {
  categories: Array<{ name: string; count: number; slug: string }>; // 'slug' prop'unu ekledim, BlogSection'da kullanılıyor.
  popularPosts: Array<{
    _id: string; // BlogSection'dan gelen 'popularPosts' tipine uygun olarak _id ekledim.
    title: string;
    date: string;
    image: string;
    link: string; // Link prop'unu da ekledim, popüler yazılara tıklanabilir olmalı.
  }>;
  showNewsletter?: boolean; // Yeni eklediğimiz prop
}

const BlogSidebar = ({ categories, popularPosts, showNewsletter = true }: BlogSidebarProps) => {
  return (
    <div className="lg:w-1/3 space-y-8">
      <BlogCategories categories={categories} />
      
      {/* Popular Posts */}
      <Card className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="text-lg font-semibold mb-4">Popüler Yazılar</h3>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            // link prop'unu kullanarak div'i bir a etiketine çeviriyorum veya tıklanabilir yapıyorum
            <a key={post._id} href={post.link} className="flex items-start space-x-3 cursor-pointer group">
              <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center text-xs text-foreground/60 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{post.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Card>
      
      {/* Call to action - Abone Ol kısmı */}
      {showNewsletter && ( // showNewsletter prop'una göre koşullu render
        <div className="bg-primary/10 rounded-xl p-6 text-center">
          <Bookmark className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Yeni İçeriklerden Haberdar Olun</h3>
          <p className="text-foreground/70 mb-4">Son robotik gelişmelerini ve eğitim fırsatlarını kaçırmayın.</p>
          <Input 
            placeholder="E-posta adresiniz" 
            className="mb-3"
          />
          <Button className="w-full">Abone Ol</Button>
        </div>
      )}
    </div>
  );
};

export default BlogSidebar;