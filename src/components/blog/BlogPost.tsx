
import React from 'react';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPostProps {
  post: {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
    featured?: boolean;
  };
}

const BlogPost = ({ post }: BlogPostProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6 md:w-2/3">
          {post.featured && (
            <div className="mb-3">
              <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                Öne Çıkan
              </span>
            </div>
          )}
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-foreground/70 mb-4">{post.excerpt}</p>
          
          <div className="flex items-center justify-between text-sm text-foreground/60 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              <span>{post.category}</span>
            </div>
          </div>
          
          <Button variant="ghost" className="px-0 text-primary hover:text-primary/90 hover:bg-transparent group">
            Devamını Oku
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default BlogPost;
