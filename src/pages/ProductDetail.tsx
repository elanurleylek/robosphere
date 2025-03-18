
import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import components
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetails from '@/components/product/ProductDetails';
import ProductFeatures from '@/components/product/ProductFeatures';
import ProductContents from '@/components/product/ProductContents';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductReviews from '@/components/product/ProductReviews';
import ProductFAQ from '@/components/product/ProductFAQ';
import RelatedProducts from '@/components/product/RelatedProducts';
import { productFAQs } from '@/components/product/ProductData';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  
  // Example product data (in a real app, this would come from an API)
  const product = {
    id: id || '1',
    name: 'Arduino Starter Kit',
    price: 499.99,
    oldPrice: 599.99,
    discount: 17,
    rating: 4.8,
    reviewCount: 124,
    stock: 35,
    sku: 'ARD-SK-001',
    category: 'Starter Kits',
    brand: 'Arduino',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'
    ],
    description: `Arduino Starter Kit, elektronik ve programlama dünyasına giriş yapmak isteyenler için tasarlanmış kapsamlı bir settir. Kit içerisinde Arduino Uno R3 kartı, çeşitli sensörler, LED'ler, butonlar, dirençler ve bağlantı kabloları bulunmaktadır.

Bu kit ile 15 farklı proje yapabilir ve temel Arduino programlama becerilerinizi geliştirebilirsiniz. Detaylı proje kitapçığı ve videolu eğitimler ile kendi kendinize öğrenme imkanı sunar.`,
    specs: [
      { name: 'Mikrodenetleyici', value: 'Arduino Uno R3 (ATmega328P)' },
      { name: 'Giriş Voltajı', value: '7-12V' },
      { name: 'Dijital I/O Pinleri', value: '14 (6 tanesi PWM çıkışı)' },
      { name: 'Analog Giriş Pinleri', value: '6' },
      { name: 'DC Akım (I/O Pin)', value: '20 mA' },
      { name: 'Flash Bellek', value: '32 KB (0.5 KB bootloader)' },
      { name: 'SRAM', value: '2 KB' },
      { name: 'EEPROM', value: '1 KB' },
      { name: 'Saat Hızı', value: '16 MHz' }
    ],
    contents: [
      '1 adet Arduino Uno R3',
      '1 adet USB Kablo',
      '1 adet Breadboard',
      '30 adet Jumper Kablo',
      '1 adet 9V Pil bağlantısı',
      '5 adet LED (Kırmızı, Yeşil, Mavi, Sarı, Beyaz)',
      '10 adet 220Ω Direnç',
      '5 adet 10kΩ Direnç',
      '1 adet LDR (Işık sensörü)',
      '1 adet Sıcaklık Sensörü (LM35)',
      '1 adet Potansiyometre',
      '1 adet Buzzer',
      '2 adet Buton',
      '1 adet Ultrasonic Mesafe Sensörü',
      '1 adet Servo Motor',
      '1 adet Detaylı Proje Kitapçığı'
    ],
    features: [
      'Kapsamlı komponent seti',
      'Detaylı Türkçe proje kitapçığı',
      'Video eğitimler',
      '15 farklı proje yapma imkanı',
      'İleri seviye robotik projeler için uygun',
      'Robotik Okulu teknik destek'
    ]
  };
  
  // Related products data
  const relatedProducts = [
    {
      id: '2',
      name: 'Raspberry Pi 4 Model B',
      price: 999.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    },
    {
      id: '3',
      name: 'Sensör Paketi (30 Parça)',
      price: 349.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'
    },
    {
      id: '4',
      name: 'Arduino Uno R3',
      price: 249.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Product Details Section */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Images */}
              <ProductGallery images={product.images} name={product.name} />
              
              {/* Product Info */}
              <ProductDetails product={product} />
            </div>
          </div>
        </section>
        
        {/* Product Info Tabs */}
        <section className="py-12 bg-muted/30">
          <div className="container px-6 mx-auto">
            <Tabs defaultValue="ozellikler" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="ozellikler">Özellikler</TabsTrigger>
                <TabsTrigger value="icerik">Kutu İçeriği</TabsTrigger>
                <TabsTrigger value="teknik">Teknik Özellikler</TabsTrigger>
                <TabsTrigger value="yorumlar">Yorumlar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ozellikler">
                <ProductFeatures features={product.features} />
              </TabsContent>
              
              <TabsContent value="icerik">
                <ProductContents contents={product.contents} />
              </TabsContent>
              
              <TabsContent value="teknik">
                <ProductSpecs specs={product.specs} />
              </TabsContent>
              
              <TabsContent value="yorumlar">
                <ProductReviews rating={product.rating} reviewCount={product.reviewCount} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* FAQ Section */}
        <ProductFAQ faqs={productFAQs} />
        
        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
