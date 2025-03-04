
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, Filter, ShoppingCart, Star, Tag, CircuitBoard, Microchip, Cpu, Cog } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Arduino Starter Kit",
    price: 499.99,
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    category: "Starter Kits",
    popular: true
  },
  {
    id: 2,
    name: "Raspberry Pi 4 Model B",
    price: 999.99,
    rating: 4.9,
    reviewCount: 87,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    category: "Mikrodenetleyiciler",
    popular: true
  },
  {
    id: 3,
    name: "Sensör Paketi (30 Parça)",
    price: 349.99,
    rating: 4.6,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    category: "Sensörler"
  },
  {
    id: 4,
    name: "Robot Kol Kit",
    price: 799.99,
    rating: 4.7,
    reviewCount: 38,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    category: "Robotik Kitler"
  },
  {
    id: 5,
    name: "Motor Sürücü Modülü",
    price: 149.99,
    rating: 4.5,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    category: "Elektronik Komponentler"
  },
  {
    id: 6,
    name: "Mbot Eğitim Robotu",
    price: 1299.99,
    rating: 4.9,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    category: "Eğitim Robotları"
  }
];

const categories = [
  { name: "Starter Kits", icon: CircuitBoard },
  { name: "Mikrodenetleyiciler", icon: Microchip },
  { name: "Sensörler", icon: Cpu },
  { name: "Elektronik Komponentler", icon: Cog },
  { name: "Robotik Kitler", icon: CircuitBoard },
  { name: "Eğitim Robotları", icon: Cpu }
];

const Shop: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-6 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Robotik Mağaza</h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
              Robotik projeleriniz için ihtiyaç duyduğunuz tüm komponentler, kitler ve eğitim materyalleri.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-2 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  placeholder="Ürün ara..." 
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrele
              </Button>
            </div>
          </div>
        </section>
        
        {/* Categories */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Kategoriler</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border/50 rounded-xl p-4 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary inline-flex mx-auto mb-3">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Popular Products */}
        <section className="py-12 bg-background/50">
          <div className="container px-6 mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Popüler Ürünler</h2>
              <Button variant="ghost" className="gap-2 group">
                Tümünü Gör
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.popular).map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-background/50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">
                        Popüler
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground/70">{product.category}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-foreground/60 ml-1">({product.reviewCount})</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-bold">{product.price.toLocaleString('tr-TR')} ₺</div>
                      <Button className="gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Sepete Ekle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* All Products */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Tüm Ürünler</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-background/50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {product.popular && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                          Popüler
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <span className="text-sm font-medium text-foreground/70 mb-1 block">{product.category}</span>
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    
                    <div className="flex items-center mt-1 mb-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-foreground/60 ml-1">({product.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold">{product.price.toLocaleString('tr-TR')} ₺</div>
                      <Button size="sm" variant="outline" className="rounded-full p-2">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg">Daha Fazla Yükle</Button>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-primary/5">
          <div className="container px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Eksiksiz Robot Kitiyle Başlayın</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Başlangıç seviyesinden ileri seviyeye tüm robotik projeleriniz için ihtiyacınız olan komponentler tek pakette.
            </p>
            <Button size="lg" className="group">
              Starter Kitleri İncele
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
