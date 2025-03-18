
// This file contains the data structure for the product and mock data

export interface ProductSpec {
  name: string;
  value: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
}

export interface Product {
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
  image: string;
  images: string[];
  description: string;
  specs: ProductSpec[];
  contents: string[];
  features: string[];
}

// Mock FAQs
export const productFAQs: FAQ[] = [
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
];
