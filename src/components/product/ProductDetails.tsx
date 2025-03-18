
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Star, Minus, Plus, ShoppingCart, Heart, 
  Share2, TruckIcon, RotateCcw, Shield
} from 'lucide-react';

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;
    stock: number;
    sku: string;
    category: string;
    brand: string;
    description: string;
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="lg:w-3/5">
      <div className="flex items-center mb-2">
        <span className="text-sm font-medium text-foreground/70">{product.category}</span>
        <span className="mx-2">•</span>
        <span className="text-sm font-medium text-foreground/70">{product.brand}</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center mr-3">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-2 text-sm font-medium">{product.rating}</span>
        </div>
        <span className="text-sm text-foreground/70">({product.reviewCount} Değerlendirme)</span>
        <span className="mx-2">•</span>
        <span className="text-sm text-green-600 font-medium">Stokta ({product.stock})</span>
      </div>
      
      <div className="mb-6">
        <div className="flex items-end">
          <span className="text-3xl font-bold text-primary">{product.price.toLocaleString('tr-TR')} ₺</span>
          {product.oldPrice && (
            <span className="ml-3 text-lg text-foreground/60 line-through">{product.oldPrice.toLocaleString('tr-TR')} ₺</span>
          )}
          {product.discount && (
            <span className="ml-3 bg-red-100 text-red-600 text-sm font-medium px-2 py-0.5 rounded">
              -%{product.discount}
            </span>
          )}
        </div>
        <span className="text-sm text-foreground/70 mt-1">KDV Dahil</span>
      </div>
      
      <div className="mb-6">
        <p className="text-foreground/80 whitespace-pre-line">
          {product.description}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex border border-border rounded-md">
          <button 
            onClick={decreaseQuantity}
            className="px-3 py-2 flex items-center justify-center border-r border-border"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-16 text-center appearance-none focus:outline-none"
          />
          <button 
            onClick={increaseQuantity}
            className="px-3 py-2 flex items-center justify-center border-l border-border"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <Button className="flex-1" size="lg">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Sepete Ekle
        </Button>
        
        <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
          <Heart className="h-5 w-5 mr-2" />
          Favorilere Ekle
        </Button>
        
        <Button variant="ghost" size="lg" className="hidden md:flex">
          <Share2 className="h-5 w-5 mr-2" />
          Paylaş
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2 p-3 border border-border rounded-md">
          <TruckIcon className="h-5 w-5 text-primary" />
          <div>
            <span className="text-sm font-medium">Ücretsiz Kargo</span>
            <p className="text-xs text-foreground/70">300₺ üzeri siparişlerde</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 border border-border rounded-md">
          <RotateCcw className="h-5 w-5 text-primary" />
          <div>
            <span className="text-sm font-medium">14 Gün İade</span>
            <p className="text-xs text-foreground/70">Kolay iade imkanı</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 border border-border rounded-md">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <span className="text-sm font-medium">2 Yıl Garanti</span>
            <p className="text-xs text-foreground/70">Resmi distribütör garantisi</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <div>
          <span className="text-foreground/70">SKU:</span>
          <span className="ml-1 font-medium">{product.sku}</span>
        </div>
        <div>
          <span className="text-foreground/70">Kategori:</span>
          <span className="ml-1 font-medium">{product.category}</span>
        </div>
        <div>
          <span className="text-foreground/70">Marka:</span>
          <span className="ml-1 font-medium">{product.brand}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
