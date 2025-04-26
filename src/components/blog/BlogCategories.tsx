
import React from 'react';

interface Category {
  name: string;
  count: number;
}

interface BlogCategoriesProps {
  categories: Category[];
}

const BlogCategories = ({ categories }: BlogCategoriesProps) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="flex justify-between items-center hover:text-primary cursor-pointer">
            <span>{category.name}</span>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCategories;
