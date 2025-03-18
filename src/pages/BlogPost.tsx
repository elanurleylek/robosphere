
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, User, Tag, Share2, Facebook, 
  Twitter, Linkedin, ThumbsUp, MessageSquare, 
  Bookmark, ArrowLeft, ArrowRight
} from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  
  // Örnek blog yazısı verisi (gerçek uygulamada API'den gelecek)
  const post = {
    id: id || '1',
    title: 'Robotik Eğitiminde Yeni Trendler',
    content: `
    <p>Son yıllarda teknoloji ve eğitim alanındaki gelişmeler, robotik eğitiminde de önemli değişimlere yol açtı. Özellikle K-12 eğitiminde robotik, STEM müfredatının önemli bir parçası haline geldi. Bu yazıda, robotik eğitimindeki en son trendleri ve bu trendlerin öğrencilerin öğrenme deneyimleri üzerindeki etkilerini inceleyeceğiz.</p>
    
    <h2>1. Erken Yaşta Robotik Eğitimi</h2>
    <p>Artık robotik eğitimi sadece lise veya üniversite düzeyinde değil, anaokulu ve ilkokul seviyesinde de başlıyor. Çocuklar için özel olarak tasarlanmış basit robotik kitler, blok tabanlı programlama araçları ve oyun benzeri aktiviteler, çocukların erken yaşta robotik konseptleriyle tanışmalarını sağlıyor.</p>
    <p>Araştırmalar, erken yaşta robotik eğitimine maruz kalan çocukların problem çözme, eleştirel düşünme ve yaratıcılık becerilerinde önemli gelişmeler gösterdiğini ortaya koyuyor.</p>
    
    <h2>2. Blok Tabanlı Programlama'dan Metin Tabanlı Programlamaya Geçiş</h2>
    <p>Scratch ve Blockly gibi görsel programlama ortamları, öğrencilerin programlama mantığını öğrenmelerini kolaylaştırıyor. Ancak son trend, öğrencileri kademeli olarak Python, JavaScript veya C++ gibi gerçek programlama dillerine geçirmeyi amaçlıyor.</p>
    <p>Bu geçiş, öğrencilerin daha karmaşık projeler geliştirmelerine olanak tanırken, endüstride kullanılan gerçek programlama dillerinde de deneyim kazanmalarını sağlıyor.</p>
    
    <h2>3. Yapay Zeka ve Makine Öğrenimi Entegrasyonu</h2>
    <p>Robotik eğitimi artık sadece mekanik ve programlama ile sınırlı değil. Yapay zeka ve makine öğrenimi konseptleri de robotik müfredatına dahil ediliyor. Öğrenciler, robotlarını görüntü tanıma, doğal dil işleme ve öğrenme algoritmaları ile donatabiliyorlar.</p>
    <p>Google'ın Teachable Machine gibi araçlar, öğrencilerin makine öğrenimi modellerini eğitmelerini ve bu modelleri robotik projelerinde kullanmalarını kolaylaştırıyor.</p>
    
    <h2>4. Disiplinlerarası Projeler</h2>
    <p>Robotik eğitimi artık sadece mühendislik ve bilgisayar bilimi ile sınırlı değil. Eğitimciler, robotik projelerini sanat, müzik, biyoloji ve hatta sosyal bilimler gibi farklı disiplinlerle entegre ediyorlar.</p>
    <p>Örneğin, öğrenciler müzik çalan robotlar tasarlayabilir, biyomimetik (doğayı taklit eden) robotlar geliştirebilir veya sosyal sorunları ele alan robotik çözümler üretebilirler.</p>
    
    <h2>5. Uzaktan ve Hibrit Robotik Eğitimi</h2>
    <p>COVID-19 pandemisi, uzaktan eğitimin önemini vurguladı. Robotik eğitiminde de uzaktan ve hibrit eğitim modelleri geliştirildi. Sanal robotik laboratuvarları, simülasyon araçları ve evde kullanılabilen robotik kitler, öğrencilerin fiziksel olarak sınıfta olmadan da robotik öğrenmeye devam etmelerini sağlıyor.</p>
    <p>Tinkercad, VirtualBox ve RobotC gibi simülasyon araçları, öğrencilerin sanal ortamda robotlar tasarlamalarına, programlamalarına ve test etmelerine olanak tanıyor.</p>
    
    <h2>Sonuç</h2>
    <p>Robotik eğitimindeki bu trendler, öğrencilere daha zengin, daha erişilebilir ve daha ilgi çekici öğrenme deneyimleri sunuyor. Gelecekte, robotik eğitiminin daha da yaygınlaşacağını ve öğrencilere 21. yüzyıl becerilerini kazandırmada önemli bir rol oynayacağını öngörebiliriz.</p>
    <p>Siz de çocuğunuzun veya öğrencilerinizin bu trendlerden yararlanmasını ve robotik dünyasına adım atmasını istiyorsanız, Robotik Okulu'nun yaş gruplarına özel tasarlanmış programlarını inceleyebilirsiniz.</p>
    `,
    author: 'Ahmet Yılmaz',
    authorTitle: 'Robotik Eğitim Uzmanı',
    date: '10 Haziran 2023',
    category: 'Eğitim',
    readTime: '6 dk okuma',
    tags: ['Robotik Eğitim', 'STEM', 'Teknoloji', 'Yapay Zeka', 'Kodlama'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    likes: 24,
    comments: 8
  };
  
  // İlgili yazılar
  const relatedPosts = [
    {
      id: '2',
      title: 'Yapay Zeka ve Robotik: Geleceğin Teknolojileri',
      excerpt: 'Yapay zeka ve robotiğin bir araya gelmesiyle oluşan yeni teknolojik gelişmeler ve bunların geleceğe etkileri.',
      author: 'Ayşe Kaya',
      date: '22 Mayıs 2023',
      category: 'Teknoloji',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475'
    },
    {
      id: '3',
      title: 'Ev Robotları: Günlük Hayatımızdaki Robotik Asistanlar',
      excerpt: 'Günlük hayatımızı kolaylaştıran ev robotlarının kullanım alanları ve geleceği hakkında kapsamlı bir inceleme.',
      author: 'Mehmet Demir',
      date: '8 Mayıs 2023',
      category: 'Günlük Yaşam',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-foreground/70 text-sm">{post.readTime}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-sm text-foreground/70">{post.authorTitle}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-foreground/70">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{post.date}</span>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden mb-8 h-[300px] md:h-[400px]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-muted text-foreground/80 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Blog Content */}
        <section className="py-12 bg-background">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <div className="prose prose-lg max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: post.content }} />
                
                {/* Article Actions */}
                <div className="max-w-4xl mx-auto mt-12 border-t border-border pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <Button variant="outline" className="gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>Beğen ({post.likes})</span>
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Yorum Yap ({post.comments})</span>
                      </Button>
                      <Button variant="outline" className="gap-2 hidden sm:flex">
                        <Bookmark className="h-4 w-4" />
                        <span>Kaydet</span>
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
                        <Facebook className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
                        <Twitter className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
                        <Linkedin className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
                        <Share2 className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Author Box */}
                <div className="max-w-4xl mx-auto mt-12">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Yazar Hakkında</h3>
                          <h4 className="font-medium">{post.author}</h4>
                          <p className="text-foreground/70 mb-4">{post.authorTitle}</p>
                          <p className="text-foreground/80">
                            10 yılı aşkın süredir robotik eğitimi alanında çalışmaktadır. Çeşitli eğitim kurumlarında robotik eğitim programları geliştirmiş ve yüzlerce öğrenciye mentorluk yapmıştır.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Navigation */}
                <div className="max-w-4xl mx-auto mt-12">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button variant="outline" className="flex-1 justify-start gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      <div className="text-left">
                        <div className="text-xs text-foreground/70">Önceki Yazı</div>
                        <div className="font-medium truncate max-w-[200px]">Arduino ile Basit Robotik Projeleri</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="flex-1 justify-end gap-2">
                      <div className="text-right">
                        <div className="text-xs text-foreground/70">Sonraki Yazı</div>
                        <div className="font-medium truncate max-w-[200px]">Yapay Zeka ve Robotik: Geleceğin Teknolojileri</div>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Comments */}
                <div className="max-w-4xl mx-auto mt-12">
                  <h3 className="text-2xl font-bold mb-6">Yorumlar ({post.comments})</h3>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">Zeynep Aydın</h4>
                                <span className="text-sm text-foreground/70">5 Haziran 2023</span>
                              </div>
                              <Button variant="ghost" size="sm">Yanıtla</Button>
                            </div>
                            <p className="text-foreground/80">
                              Harika bir yazı olmuş. Özellikle yapay zeka ve robotik entegrasyonu konusundaki bilgiler çok faydalıydı. Teşekkürler.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">Ali Kara</h4>
                                <span className="text-sm text-foreground/70">3 Haziran 2023</span>
                              </div>
                              <Button variant="ghost" size="sm">Yanıtla</Button>
                            </div>
                            <p className="text-foreground/80">
                              Çocuğum için robotik eğitimi araştırıyordum, bu yazı sayesinde nereden başlaması gerektiğini anladım. Teşekkürler!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Comment Form */}
                  <div className="mt-8">
                    <h4 className="font-semibold mb-4">Yorum Ekle</h4>
                    <textarea 
                      className="w-full p-4 border border-border rounded-md resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Düşüncelerinizi paylaşın..."
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <Button>Yorum Gönder</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-8">
                {/* Related Posts */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">İlgili Yazılar</h3>
                    
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost, index) => (
                        <div key={index} className="flex items-start space-x-3 cursor-pointer group">
                          <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden">
                            <img 
                              src={relatedPost.image} 
                              alt={relatedPost.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link to={`/blog/${relatedPost.id}`} className="font-medium group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </Link>
                            <div className="flex items-center text-xs text-foreground/60 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{relatedPost.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Categories */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
                    <div className="space-y-2">
                      {['Eğitim', 'Teknoloji', 'Projeler', 'Günlük Yaşam', 'Yarışmalar'].map((category, index) => (
                        <div key={index} className="flex justify-between items-center hover:text-primary cursor-pointer">
                          <span>{category}</span>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {[15, 23, 18, 9, 12][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tags */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Robotik', 'Eğitim', 'STEM', 'Arduino', 'Yapay Zeka', 'Kodlama', 'Teknoloji', 'Projeler', 'Workshop', 'Yarışma'].map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-muted text-foreground/80 text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Newsletter */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Bültenimize Abone Olun</h3>
                    <p className="text-foreground/70 mb-4">
                      Robotik dünyasındaki son gelişmeler ve eğitim fırsatları hakkında bilgi almak için abone olun.
                    </p>
                    <div className="space-y-2">
                      <input 
                        type="email" 
                        placeholder="E-posta adresiniz" 
                        className="w-full p-2 border border-border rounded-md"
                      />
                      <Button className="w-full">Abone Ol</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
