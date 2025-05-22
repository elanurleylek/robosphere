import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostFooter from './PostFooter';

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
      <CardContent className="p-0">
        <PostHeader 
          title={post.title}
          author={post.author}
          date={post.date}
          category={post.category}
          featured={post.featured}
        />
        <PostContent 
          excerpt={post.excerpt}
          image={post.image}
          title={post.title}
        />
        <div className="px-6 pb-6">
          <PostFooter />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPost;
