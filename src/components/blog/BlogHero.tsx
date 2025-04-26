
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const BlogHero = () => {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
      <div className="container px-6 mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Robotik Dünyasından Güncel İçerikler</h1>
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
          Robotik teknolojileri, eğitim trendleri ve ilham verici projeler hakkında en güncel bilgileri keşfedin.
        </p>
        
        <div className="max-w-xl mx-auto flex gap-2 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input 
              placeholder="Blog içeriği ara..." 
              className="pl-10 h-12"
            />
          </div>
          <Button>Ara</Button>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
