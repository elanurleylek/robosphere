// src/pages/BlogPost.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
// Kullanılmayan ikon importları kaldırılabilir (sadece Calendar, User, Tag kullanılıyor)
import {
  Calendar, User, Tag, // Share2, Facebook, Twitter, Linkedin, ThumbsUp, MessageSquare, Bookmark, ArrowLeft, ArrowRight
} from 'lucide-react';
import { blogApi, STATIC_FILES_DOMAIN } from '../lib/api'; // <-- STATIC_FILES_DOMAIN buraya import edildi
import { BlogPost as BlogPostType, BlogPostAuthor, ApiError } from '@/lib/types';


const BlogPostPage: React.FC = () => { // Adını BlogPostPage olarak değiştirdim (daha açıklayıcı)
  const { id } = useParams<{ id: string }>(); // id'nin string olduğunu belirt
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("Geçersiz yazı ID'si.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // API'den yazıyı çek - Backend kodunuz populate ettiğini gösteriyor
        const data = await blogApi.getById(id);
        console.log("Fetched Blog Post Data for Detail Page:", data); // Debug için konsola yazdır
        setPost(data);
      } catch (err) {
        console.error("Blog yazısı çekilirken hata oluştu:", err);
        setError(err instanceof Error ? err.message : 'Yazı yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // id değiştiğinde tekrar çek

  // Yazar adını almak için yardımcı fonksiyon - backend populate ettiğinde obje alacak şekilde güncellendi
  const getAuthorName = (author: BlogPostType['author']): string => {
    if (!author) return 'Bilinmiyor';
    if (typeof author === 'string') {
        // Backend populate etmiyorsa (sadece ID geldi) - Backend kodunuz populate ettiği için burası çalışmamalı
         console.warn("Yazar detay sayfasında populate edilmemiş olarak geldi:", author); // Debug için eklendi
        return 'Bilinmiyor (Populate Hatası?)'; // Daha açıklayıcı bir mesaj
    }
    // Backend populate ettiyse (BlogPostAuthor tipinde) bu kısım çalışır
    // Burası önemli: username veya name yoksa 'Bilinmiyor' döner
    return author.username || author.name || 'Bilinmiyor';
  };

  // Loading, error, not found durumları için erken dönüşler
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 flex justify-center items-center">
           <p className="text-xl text-gray-600 dark:text-gray-300">Yazı yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
         <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <div className="text-red-600 p-6 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3">Oops! Bir Sorun Oluştu</h2>
            <p className="text-md">{error}</p>
            <Link to="/blog">
              <Button variant="outline" className="mt-6">Blog Sayfasına Geri Dön</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
       <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">İstenen blog yazısı bulunamadı.</p>
          <Link to="/blog">
            <Button variant="outline" className="mt-6">Blog Sayfasına Geri Dön</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Resim URL'sini oluşturma mantığı eklendi - blog kartlarındaki mantığın aynısı
  const imageUrl = post.imageUrl ?
    (post.imageUrl.startsWith('http') ? post.imageUrl : `${STATIC_FILES_DOMAIN}${post.imageUrl.startsWith('/') ? post.imageUrl : '/' + post.imageUrl}`)
    : null; // imageUrl yoksa null olacak

  // Her şey yolundaysa blog yazısını göster
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1"> {/* main flex-1 yaparak içeriğin footer'ı aşağı itmesini sağla */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-4">
              <div className="flex items-center">
                <User className="mr-2" size={16} />
                <span>{getAuthorName(post.author)}</span> {/* Yazar adı burada gösteriliyor */}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tarih Yok'}</span>
              </div>
            </div>
            {/* Etiketler burada gösteriliyor */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Tag className="mr-1 self-center text-gray-400 dark:text-gray-500" size={16}/>
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
             {/* Kategori bilgisini yazı detayında göstermek istemiyorsanız buraya eklemeyin */}
             {/* {post.category && (
                 <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                    <Folder className="mr-2" size={16} />
                    <span>{post.category}</span>
                 </div>
             )} */}
          </header>

          {/* Resim yükleme alanı - oluşturulan imageUrl varsa resmi gösterir */}
          {imageUrl ? (
            <img
              src={imageUrl} // <-- Tam URL artık burada kullanılıyor
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8 shadow-lg"
              onError={(e) => { // Hata durumunda varsayılan resim gösterme
                console.warn("Blog detay resmi yüklenemedi:", (e.target as HTMLImageElement).src);
                (e.target as HTMLImageElement).onerror = null; // Sonsuz döngüyü engelle
                (e.target as HTMLImageElement).src = '/default-blog.png'; // Varsayılan resminizin yolu (public klasöründe olmalı)
                (e.target as HTMLImageElement).classList.add('object-contain'); // Varsayılan resim için stil
              }}
            />
          ) : (
             // imageUrl yoksa veya null ise placeholder veya mesaj gösterilir
            <div className="w-full h-auto max-h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 shadow-lg flex items-center justify-center py-16 px-4">
                <p className="text-gray-500 dark:text-gray-400 text-center">Bu yazı için görsel bulunmamaktadır.</p>
            </div>
          )}


          {/* Blog içeriği - dangerouslySetInnerHTML ile gösterilir */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Beğenme ve Paylaşma Butonları KALDIRILDI */}
          {/* Eğer footer'da başka bir şey yoksa footer etiketi de kaldırılabilir */}
          {/* <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
               ... kaldırılan butonlar ve linkler buradaydı ...
          </footer> */}

        </article>
      </main>
      <Footer /> {/* Footer en altta, ana component'in dönüşünde bir kere render edilir */}
    </div>
  );
};

export default BlogPostPage;