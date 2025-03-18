
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  faqs: FAQ[];
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ faqs }) => {
  return (
    <section className="py-12 bg-background">
      <div className="container px-6 mx-auto">
        <h2 className="text-2xl font-bold mb-8">Sıkça Sorulan Sorular</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-3 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-foreground/80">{faq.answer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline">
            Tüm SSS'leri Görüntüle
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
