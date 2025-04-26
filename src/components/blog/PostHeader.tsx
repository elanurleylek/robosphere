
import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';

interface PostHeaderProps {
  title: string;
  author: string;
  date: string;
  category: string;
  featured?: boolean;
}

const PostHeader = ({ title, author, date, category, featured }: PostHeaderProps) => {
  return (
    <div className="mb-4">
      {featured && (
        <div className="mb-3">
          <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
            Öne Çıkan
          </span>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      
      <div className="flex items-center justify-between text-sm text-foreground/60">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span>{author}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1" />
          <span>{category}</span>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
