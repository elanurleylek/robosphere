
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Spec {
  name: string;
  value: string;
}

interface ProductSpecsProps {
  specs: Spec[];
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({ specs }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6">Teknik Özellikler</h3>
        
        <div className="space-y-4">
          {specs.map((spec, index) => (
            <div key={index} className={`grid grid-cols-3 gap-4 py-3 ${index !== 0 ? 'border-t border-border' : ''}`}>
              <div className="font-medium">{spec.name}</div>
              <div className="col-span-2">{spec.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSpecs;
