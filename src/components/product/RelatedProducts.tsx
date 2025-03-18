
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-6 mx-auto">
        <h2 className="text-2xl font-bold mb-8">Benzer Ürünler</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                
                <div className="flex items-center mt-1 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">{product.price.toLocaleString('tr-TR')} ₺</div>
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
