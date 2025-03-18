
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, Minus, Plus, ShoppingCart, Heart, 
  Share2, TruckIcon, RotateCcw, Shield, MessageSquare, 
  CheckCircle, HelpCircle, ThumbsUp
} from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  
  // Örnek ürün verisi (gerçek uygulamada API'den gelecek)
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
  
  // İlgili ürünler
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
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Product Details Section */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Images */}
              <div className="lg:w-2/5">
                <div className="rounded-xl overflow-hidden mb-4 h-[300px] md:h-[400px]">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((image, index) => (
                    <div key={index} className="rounded-md overflow-hidden h-24 cursor-pointer border border-border hover:border-primary transition-colors">
                      <img 
                        src={image} 
                        alt={`${product.name} - ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
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
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Ürün Özellikleri</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-3 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="icerik">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Kutu İçeriği</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.contents.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-3 shrink-0 text-primary" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="teknik">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Teknik Özellikler</h3>
                    
                    <div className="space-y-4">
                      {product.specs.map((spec, index) => (
                        <div key={index} className={`grid grid-cols-3 gap-4 py-3 ${index !== 0 ? 'border-t border-border' : ''}`}>
                          <div className="font-medium">{spec.name}</div>
                          <div className="col-span-2">{spec.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="yorumlar">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Değerlendirmeler ve Yorumlar</h3>
                      <Button>Değerlendirme Yap</Button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                      <div className="md:w-1/3 flex flex-col items-center justify-center p-6 border border-border rounded-xl">
                        <div className="text-5xl font-bold mb-2">{product.rating}</div>
                        <div className="flex mb-2">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <div className="text-sm text-foreground/70">Toplam {product.reviewCount} değerlendirme</div>
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
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Sıkça Sorulan Sorular</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  question: 'Arduino Starter Kit ile hangi projeleri yapabilirim?',
                  answer: 'Kit ile 15 farklı proje yapabilirsiniz. LED kontrolü, sıcaklık ölçümü, ultrasonik mesafe sensörü kullanımı, servo motor kontrolü gibi temel projelerden, daha karmaşık olan ışık takip eden robot ve benzeri projelere kadar çeşitli uygulamalar yapabilirsiniz.'
                },
                { 
                  question: 'Bu kit programlama bilmeyenler için uygun mu?',
                  answer: 'Evet, kit programlama deneyimi olmayanlar için de uygundur. Kitapçık ve video eğitimler adım adım rehberlik eder ve Arduino programlama temellerini sıfırdan öğretir.'
                },
                { 
                  question: 'Arduino IDE\'yi nasıl kurarım?',
                  answer: 'Arduino IDE\'yi Arduino\'nun resmi web sitesinden ücretsiz olarak indirebilirsiniz. Kit içerisindeki kitapçıkta kurulum adımları detaylı olarak anlatılmıştır. Ayrıca Robotik Okulu web sitesinde de kurulum rehberi mevcuttur.'
                },
                { 
                  question: 'Bu kit hangi yaş grubu için uygundur?',
                  answer: 'Kit genel olarak 12 yaş ve üzeri için uygundur, ancak yetişkin gözetiminde daha küçük yaştaki çocuklar da kullanabilir. Elektronik ve programlama konularına ilgi duyan herkes bu kiti kullanabilir.'
                }
              ].map((faq, index) => (
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
        
        {/* Related Products */}
        <section className="py-12 bg-muted/30">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Benzer Ürünler</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
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
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
