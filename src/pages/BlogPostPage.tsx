// src/pages/BlogPost.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } // Link import edildi
from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card'; // Kullanılmıyorsa kaldırılabilir
import {
  Calendar, User, Tag, Share2, Facebook,
  Twitter, Linkedin, ThumbsUp, // MessageSquare, Bookmark, ArrowLeft, ArrowRight (Kullanılmıyorsa kaldırılabilir)
} from 'lucide-react';
import { blogApi } from '../lib/api';
import { BlogPostType } from './Blog'; // Blog.tsx'ten BlogPostType'ı import et (veya types.ts'e taşıdıysanız oradan)


// BlogPost component'i için ayrı bir props interface'ine gerek yok, BlogPostType'ı kullanabiliriz.

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
        const data = await blogApi.getById(id);
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

  // Yazar adını almak için yardımcı fonksiyon
  const getAuthorName = (author: BlogPostType['author']): string => {
    if (!author) return 'Bilinmiyor';
    if (typeof author === 'string') return author;
    return author.name || 'Bilinmiyor';
  };


  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl text-gray-600 dark:text-gray-300">Yazı yükleniyor...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-red-600 p-6 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3">Oops! Bir Sorun Oluştu</h2>
            <p className="text-md">{error}</p>
            <Link to="/blog">
              <Button variant="outline" className="mt-6">Blog Sayfasına Geri Dön</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">İstenen blog yazısı bulunamadı.</p>
          <Link to="/blog">
            <Button variant="outline" className="mt-6">Blog Sayfasına Geri Dön</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-4">
            <div className="flex items-center">
              <User className="mr-2" size={16} />
              <span>{getAuthorName(post.author)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2" size={16} />
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tarih Yok'}</span>
            </div>
          </div>
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
        </header>

        {post.imageUrl && (
          <img
            src={post.imageUrl} // Backend'den gelen URL'yi kullan
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8 shadow-lg"
          />
        )}

        {/* Tailwind Typography eklentisi varsa 'prose' class'ları HTML içeriğini güzelleştirir */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none break-words" // prose-invert dark mode için
          dangerouslySetInnerHTML={{ __html: post.content }} // Backend'den gelen HTML içeriği
        />

        {/* Beğenme ve Paylaşma Butonları (İşlevsellik Eklenebilir) */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button variant="outline" className="flex items-center w-full sm:w-auto">
              <ThumbsUp className="mr-2" size={18} />
              Beğen
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Paylaş:</span>
              <Button variant="outline" size="icon" asChild>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta Paylaş">
                  <Facebook size={18} />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter'da Paylaş">
                  <Twitter size={18} />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                 <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn'de Paylaş">
                  <Linkedin size={18} />
                </a>
              </Button>
            </div>
          </div>
        </footer>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPostPage; // Adı BlogPostPage olarak değiştirildi