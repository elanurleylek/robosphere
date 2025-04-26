
import React from 'react';

interface PostContentProps {
  excerpt: string;
  image: string;
  title: string;
}

const PostContent = ({ excerpt, image, title }: PostContentProps) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 h-48 md:h-auto">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 md:w-2/3">
        <p className="text-foreground/70 mb-4">{excerpt}</p>
      </div>
    </div>
  );
};

export default PostContent;
