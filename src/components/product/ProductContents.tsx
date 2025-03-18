
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ProductContentsProps {
  contents: string[];
}

const ProductContents: React.FC<ProductContentsProps> = ({ contents }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6">Kutu İçeriği</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contents.map((item, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductContents;
