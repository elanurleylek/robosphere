
import React from 'react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  return (
    <div className="lg:w-2/5">
      <div className="rounded-xl overflow-hidden mb-4 h-[300px] md:h-[400px]">
        <img 
          src={images[0]} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div key={index} className="rounded-md overflow-hidden h-24 cursor-pointer border border-border hover:border-primary transition-colors">
            <img 
              src={image} 
              alt={`${name} - ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
