
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PostFooter = () => {
  return (
    <Button variant="ghost" className="px-0 text-primary hover:text-primary/90 hover:bg-transparent group">
      Devamını Oku
      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
};

export default PostFooter;
