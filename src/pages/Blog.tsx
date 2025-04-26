import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPost from '@/components/blog/BlogPost';
import BlogHero from '@/components/blog/BlogHero';
import BlogSidebar from '@/components/blog/BlogSidebar';
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
        <BlogHero />
        
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
              
              <BlogSidebar 
                categories={categories} 
                popularPosts={blogPosts.slice(0, 3)} 
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
