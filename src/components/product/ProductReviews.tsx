
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

interface ProductReviewsProps {
  rating: number;
  reviewCount: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ rating, reviewCount }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Değerlendirmeler ve Yorumlar</h3>
          <Button>Değerlendirme Yap</Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/3 flex flex-col items-center justify-center p-6 border border-border rounded-xl">
            <div className="text-5xl font-bold mb-2">{rating}</div>
            <div className="flex mb-2">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <div className="text-sm text-foreground/70">Toplam {reviewCount} değerlendirme</div>
          </div>
          
          <div className="md:w-2/3">
            {[5, 4, 3, 2, 1].map((star) => {
              // Örnek değerlendirme oranları
              const percent = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 6 : star === 2 ? 3 : 1;
              return (
                <div key={star} className="flex items-center mb-2">
                  <div className="flex items-center w-20">
                    <span className="text-sm mr-2">{star}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-sm">{percent}%</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Örnek yorumlar */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium">Ahmet Yılmaz</div>
                <div className="text-sm text-foreground/70">20 Mayıs 2023</div>
              </div>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-4 w-4 text-yellow-500 fill-yellow-500" 
                  />
                ))}
              </div>
            </div>
            <p className="text-foreground/80 mb-4">
              Başlangıç için harika bir kit. İçinde ihtiyacım olan her şey vardı ve projeleri yapmak çok kolay oldu. Kitapçık çok detaylı ve yardımcı.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-foreground/70">Bu yorum faydalı mıydı?</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>Evet (12)</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>Yanıtla</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium">Zeynep Kaya</div>
                <div className="text-sm text-foreground/70">5 Nisan 2023</div>
              </div>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-foreground/80 mb-4">
              Oğluma robotik eğitim için aldım. Çok memnun kaldık. Videolu anlatımlar çok yardımcı oldu ve birçok proje yapabildi.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-foreground/70">Bu yorum faydalı mıydı?</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>Evet (8)</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>Yanıtla</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline">Daha Fazla Yorum Göster</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
