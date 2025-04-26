import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bookmark, Calendar, Search } from 'lucide-react';
import BlogPost from '@/components/blog/BlogPost';
import BlogCategories from '@/components/blog/BlogCategories';
import BlogPagination from '@/components/blog/BlogPagination';

const blogPosts = [
  {
    title: "Robotik Eğitiminde Yeni Trendler",
    excerpt: "Son yıllarda robotik eğitiminde ortaya çıkan yeni trendleri ve bu trendlerin eğitim üzerindeki etkilerini inceliyoruz.",
    author: "Ahmet Yılmaz",
    date: "10 Haziran 2023",
    category: "Eğitim",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    featured: true
  },
  {
    title: "Yapay Zeka ve Robotik: Geleceğin Teknolojileri",
    excerpt: "Yapay zeka ve robotiğin bir araya gelmesiyle oluşan yeni teknolojik gelişmeleri ve bunların geleceğe etkilerini ele alıyoruz.",
    author: "Ayşe Kaya",
    date: "22 Mayıs 2023",
    category: "Teknoloji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Ev Robotları: Günlük Hayatımızdaki Robotik Asistanlar",
    excerpt: "Günlük hayatımızı kolaylaştıran ev robotlarını, kullanım alanlarını ve geleceğini inceliyoruz.",
    author: "Mehmet Demir",
    date: "8 Mayıs 2023",
    category: "Günlük Yaşam",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    title: "Arduino ile Basit Robotik Projeleri",
    excerpt: "Evde kolayca yapabileceğiniz Arduino tabanlı robotik projelerine dair adım adım rehber.",
    author: "Zeynep Aydın",
    date: "1 Mayıs 2023",
    category: "Projeler",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
  }
];

const categories = [
  { name: "Eğitim", count: 15 },
  { name: "Teknoloji", count: 23 },
  { name: "Projeler", count: 18 },
  { name: "Günlük Yaşam", count: 9 },
  { name: "Yarışmalar", count: 12 }
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-6 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Robotik Dünyasından Güncel İçerikler</h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
              Robotik teknolojileri, eğitim trendleri ve ilham verici projeler hakkında en güncel bilgileri keşfedin.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto flex gap-2 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  placeholder="Blog içeriği ara..." 
                  className="pl-10 h-12"
                />
              </div>
              <Button>Ara</Button>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-bold mb-8">Son Yazılar</h2>
                
                <div className="grid grid-cols-1 gap-8">
                  {blogPosts.map((post, index) => (
                    <BlogPost key={index} post={post} />
                  ))}
                </div>
                
                <BlogPagination />
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-8">
                <BlogCategories categories={categories} />
                
                {/* Popular Posts */}
                <Card className="bg-card rounded-xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Popüler Yazılar</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post, index) => (
                      <div key={index} className="flex items-start space-x-3 cursor-pointer group">
                        <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center text-xs text-foreground/60 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Call to action */}
                <div className="bg-primary/10 rounded-xl p-6 text-center">
                  <Bookmark className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Yeni İçeriklerden Haberdar Olun</h3>
                  <p className="text-foreground/70 mb-4">Son robotik gelişmelerini ve eğitim fırsatlarını kaçırmayın.</p>
                  <Input 
                    placeholder="E-posta adresiniz" 
                    className="mb-3"
                  />
                  <Button className="w-full">Abone Ol</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
