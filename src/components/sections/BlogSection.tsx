'use client';

import React, { useEffect, useState, FormEvent, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BlogHero from '@/components/blog/BlogHero'; // BlogHero hala burada çağrılıyor, içindeki arama inputunu el ile silmeniz/kaldırmanız gerekiyor
// import BlogSidebar from '@/components/blog/BlogSidebar'; // <-- BlogSidebar kaldırıldı
// import BlogPagination from '@/components/blog/BlogPagination'; // Pagination ihtiyacınız yoksa yorumda kalabilir

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { blogApi, STATIC_FILES_DOMAIN } from '@/lib/api'; // blogApi ve STATIC_FILES_DOMAIN import edildi
import { useAuth } from '@/hooks/useAuth';
import { Trash2, Edit, Loader2, Calendar, User as UserIcon } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  BlogPost as BlogPostType,
  BlogPostAuthor,
  ApiError,
  BlogCreatePayload, BlogUpdatePayload
} from '@/lib/types';


export interface BlogPostCardData {
  _id: string; title: string; excerpt: string; author: string; authorId?: string; authorAvatar?: string | null;
  date: string; category: string; image: string; link: string;
}

// Sidebar için hazırlanan useMemo'lar ve interface'ler kaldırıldı

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null); // File input ref'i
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const { userInfo } = useAuth();
  const { toast } = useToast();

  const fetchBlogPosts = async () => {
    setIsLoading(true); setError(null);
    try {
        // blogApi.getAll yazar bilgisini populate ederek dönmeli
        // Backend kodunuz populate ettiğini gösteriyor
        const data = await blogApi.getAll();
        setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
        const apiErr = err as ApiError;
        console.error("Blogları çekerken hata:", apiErr.details || apiErr.message || err);
        setError(apiErr.message || 'Bloglar yüklenemedi.');
    } finally {
        setIsLoading(false);
    }
  };

   const resetForm = useCallback(() => {
    setFormTitle(''); setFormContent(''); setFormCategory(''); setFormTags(''); setFormImageFile(null); setRemoveCurrentImage(false);
    // Hata olan satırın düzeltilmiş hali: Ref'in current'ının value'su
    if (imageInputRef.current) {
        imageInputRef.current.value = "";
    }
    setFormError(null);
    // Form resetlenince düzenleme modundan çık
    setEditingPost(null);
  }, []); // useCallback bağımlılıkları: resetForm dışarıdaki state setter'ları kullanıyor, bu yüzden boş dizi güvenlidir.


  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       // Dosya boyutu ve tipi kontrolü
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (file.size > maxFileSize) {
          toast({ title: "Dosya Boyutu Büyük", description: `Resim dosyası ${maxFileSize / (1024 * 1024)}MB'den büyük olamaz.` , variant: "destructive"});
          e.target.value = ''; setFormImageFile(null); setRemoveCurrentImage(editingPost ? false : false); return;
      }
      if (!allowedTypes.includes(file.type)) {
          toast({ title: "Hatalı Dosya Türü", description: "Sadece JPEG, PNG veya GIF formatında resim yükleyebilirsiniz." , variant: "destructive"});
          e.target.value = ''; setFormImageFile(null); setRemoveCurrentImage(editingPost ? false : false); return;
      }

      setFormImageFile(file);
      setRemoveCurrentImage(false); // Yeni dosya seçildiğinde mevcut olanı kaldırma seçeneğini sıfırla
    } else {
      setFormImageFile(null);
    }
  };

  const handleEditClick = (postToEdit: BlogPostType) => {
    resetForm(); // Önce formu ve editingPost state'ini sıfırla
    setEditingPost(postToEdit); // Sonra düzenlenecek postu set et
    setFormTitle(postToEdit.title);
    setFormContent(postToEdit.content);
    setFormCategory(postToEdit.category || '');
    setFormTags(postToEdit.tags ? postToEdit.tags.join(', ') : '');
    setFormImageFile(null);
    setRemoveCurrentImage(false);
    // input ref'ini sıfırla (resetForm zaten yapıyor)
    // if (imageInputRef.current) imageInputRef.current.value = "";
    // Forma kaydır
    const formCard = document.getElementById("blog-form-card");
    if (formCard) formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddOrUpdateBlogPost = async (e: FormEvent) => {
    e.preventDefault(); setFormError(null);
    if (!formTitle.trim() || !formContent.trim()) { setFormError('Başlık ve içerik alanları zorunludur.'); toast({ title: "Eksik Bilgi", description: "Başlık ve içerik alanları zorunludur.", variant: "destructive" }); return; }
    if (!userInfo?.token) { setFormError('Bu işlemi yapmak için giriş yapmalısınız.'); toast({ title: "Yetkilendirme Hatası", description: "Lütfen giriş yapın.", variant: "destructive" }); return; }
    setFormSubmitting(true);
    const formData = new FormData();
    formData.append('title', formTitle.trim());
    formData.append('content', formContent.trim());
    if (formCategory.trim()) formData.append('category', formCategory.trim());
    const tagsArray = formTags.trim() ? formTags.trim().split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    if (tagsArray.length > 0) { tagsArray.forEach(tag => { formData.append('tags', tag); }); }
    const excerptValue = formContent.trim().substring(0, Math.min(formContent.trim().length, 150)) + (formContent.trim().length > 150 ? '...' : '');
    formData.append('excerpt', excerptValue);

    // Resim yükleme veya kaldırma mantığı
    if (formImageFile) {
       formData.append('image', formImageFile, formImageFile.name);
    } else if (editingPost) {
       if (removeCurrentImage) {
           formData.append('removeImage', 'true');
       }
    }

    try {
      let messageTitle = ''; let messageDescription = ''; let updatedOrNewPost: BlogPostType;
      if (editingPost) {
        if (!editingPost._id) throw new Error("Düzenlenecek yazı ID'si bulunamadı.");
        updatedOrNewPost = await blogApi.update(editingPost._id, formData) as BlogPostType;
        setPosts(prevPosts => prevPosts.map(p => p._id === updatedOrNewPost._id ? updatedOrNewPost : p));
        messageTitle = "Başarıyla Güncellendi!"; messageDescription = `"${updatedOrNewPost.title}" adlı yazı güncellendi.`;
      }
      else {
        updatedOrNewPost = await blogApi.create(formData) as BlogPostType;
        setPosts(prevPosts => [updatedOrNewPost, ...prevPosts]);
        messageTitle = "Başarıyla Eklendi!"; messageDescription = `"${updatedOrNewPost.title}" adlı yazı sisteme eklendi.`;
      }
      toast({ title: messageTitle, description: messageDescription });
      resetForm();

      // Başarılı işlem sonrası listeyi yeniden çekmeye genellikle gerek yok, API yanıtı populate edilmiş dönüyorsa
      // fetchBlogPosts();

    } catch (err) {
      const apiErr = err as ApiError; console.error("Blog ekleme/güncelleme hatası:", err);
      const errorMessage = apiErr.message || (err instanceof Error ? err.message : 'İşlem sırasında bir hata oluştu.');
      setFormError(errorMessage);
      toast({ title: "Hata Oluştu", description: errorMessage, variant: "destructive" });
    }
    finally { setFormSubmitting(false); }
  };


  const handleDeleteClick = (postId: string) => {
    setDeletingPostId(postId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!deletingPostId || !userInfo?.token) return;
    setIsProcessingDelete(true);
    try {
      await blogApi.delete(deletingPostId);
      toast({ title: "Başarılı", description: "Blog yazısı silindi." });
      setPosts(prevPosts => prevPosts.filter(post => post._id !== deletingPostId));
    } catch (err) {
      const apiErr = err as ApiError;
      console.error("Blog silme hatası:", err);
      const errorMessage = apiErr.message || (err instanceof Error ? err.message : 'Blog yazısı silinemedi.');
      toast({ title: "Silme Başarısız", description: errorMessage, variant: "destructive" });
    } finally {
      setIsProcessingDelete(false);
      setIsDeleteDialogOpen(false);
      setDeletingPostId(null);
    }
  };

  // Yazar detaylarını populate edilmiş objeden alma fonksiyonu
  const getAuthorDetails = useCallback((authorData: BlogPostType['author']): { id?: string; name: string; avatar?: string | null } => {
    if (!authorData) return { name: 'Bilinmiyor' };
    if (typeof authorData === 'string') { // Backend populate etmediyse (sadece ID geldi)
       // Backend kodunuz populate ettiği için bu kısım normalde çalışmamalı
       console.warn("Yazar populate edilmemiş olarak geldi:", authorData); // Debug için eklendi
       return { id: authorData, name: `Yazar ID: ${authorData.substring(0,6)}...`, avatar: null };
    }
    // Backend populate ettiyse (BlogPostAuthor tipinde) bu kısım çalışır
    return {
      id: authorData._id,
      // Burası önemli: username veya name yoksa 'Bilinmiyor' döner
      name: authorData.username || authorData.name || 'Bilinmiyor',
      avatar: authorData.avatar || null
    };
  }, []);


  const postsForCards: BlogPostCardData[] = useMemo(() => {
    return posts.map((post) => {
        const authorDetails = getAuthorDetails(post.author);
        // Varsayılan placeholder resmi
        let displayImageUrl = `https://via.placeholder.com/400x200?text=${encodeURIComponent(post.title.substring(0, Math.min(post.title.length, 10)) || 'Görsel')}`;
        if (post.imageUrl) {
           // STATIC_FILES_DOMAIN backend'deki public klasörünün kök URL'si olmalı (örn: http://localhost:5000)
           // post.imageUrl genellikle '/uploads/images/...' formatında gelir
           displayImageUrl = post.imageUrl.startsWith('http') ? post.imageUrl : `${STATIC_FILES_DOMAIN}${post.imageUrl.startsWith('/') ? post.imageUrl : '/' + post.imageUrl}`;
        }

        return {
            _id: post._id,
            title: post.title,
            excerpt: post.excerpt || (post.content ? post.content.substring(0, Math.min(post.content.length, 150)) + (post.content.length > 150 ? '...' : '') : 'Özet yok.'),
            author: authorDetails.name, // <-- Yazar adı buradan alınıyor
            authorId: authorDetails.id,
            authorAvatar: authorDetails.avatar,
            date: post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tarih Yok',
            category: post.category || 'Genel', // Kategori formda var ama kartta görünmesi istenmiyorsa kaldırılabilir
            image: displayImageUrl,
            link: `/blog/${post._id}`,
        };
    });
  }, [posts, getAuthorDetails]);


  // Sidebar kaldırıldığı için sidebar ile ilgili useMemo'lar kaldırıldı


  useEffect(() => {
    fetchBlogPosts();
  }, []); // İlk renderda yazıları çek


  return (
    // AlertDialog componentini return ifadesinin en dışında sarmalayıcı olarak kullanın
    <AlertDialog open={isDeleteDialogOpen && deletingPostId !== null} onOpenChange={(open) => { if(!open) { setDeletingPostId(null); setIsDeleteDialogOpen(false); }}}>
      <section id="blog-section" className="py-12 bg-gray-50 dark:bg-gray-900">
          {/* BlogHero component'inin içinden arama inputunu el ile kaldırmanız gerekiyor */}
          <BlogHero />

          <div className="container px-4 sm:px-6 lg:px-8 mx-auto mt-12">
              {/* Sidebar kaldırıldığı için dış flex yapısı ve lg:w-2/3 kaldırıldı/değiştirildi */}
              {/* Doğrudan içerik bloğu kaldı */}
              <div className="lg:w-full"> {/* Ana içerik div'ini tam genişlik yapın */}
                  {/* Yönetici veya yazma yetkisi olan rol ise formu göster */}
                  {userInfo?.token && (
                    <Card id="blog-form-card" className="mb-12 p-4 sm:p-6 shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                          {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}
                        </CardTitle>
                        {editingPost && <CardDescription className="dark:text-gray-400">"{editingPost.title}" başlıklı yazıyı düzenliyorsunuz.</CardDescription>}
                      </CardHeader>
                      <CardContent>
                        {/* Blog Ekleme/Düzenleme Formu - Kategoriler ve Etiketler inputları burada duruyor */}
                        <form onSubmit={handleAddOrUpdateBlogPost} className="space-y-4 sm:space-y-6">
                          <div><Label htmlFor="blogTitle" className="text-gray-700 dark:text-gray-300">Başlık</Label><Input id="blogTitle" name="title" value={formTitle} onChange={e => setFormTitle(e.target.value)} required className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                          <div><Label htmlFor="blogContent" className="text-gray-700 dark:text-gray-300">İçerik</Label><Textarea id="blogContent" name="content" value={formContent} onChange={e => setFormContent(e.target.value)} rows={8} required className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              {/* Kategori inputu burada kalır eğer formda göstermek istiyorsanız */}
                              <div><Label htmlFor="blogCategory" className="text-gray-700 dark:text-gray-300">Kategori</Label><Input id="blogCategory" name="category" value={formCategory} onChange={e => setFormCategory(e.target.value)} placeholder="örn: Teknoloji" className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                              {/* Etiketler inputu burada kalır eğer formda göstermek istiyorsanız */}
                              <div><Label htmlFor="blogTags" className="text-gray-700 dark:text-gray-300">Etiketler (virgülle ayırın)</Label><Input id="blogTags" name="tags" value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="örn: react, javascript" className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                          </div>

                          <div>
                              <Label htmlFor="blogImageFile" className="text-gray-700 dark:text-gray-300">Görsel Yükle</Label>
                              <Input id="blogImageFile" name="image" type="file" accept="image/*" onChange={handleImageFileChange} ref={imageInputRef} className="text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800 cursor-pointer"/>
                              {editingPost && editingPost.imageUrl && !formImageFile && (
                                  <div className="mt-3 flex items-center space-x-3 p-2 border rounded-md dark:border-gray-700">
                                      {/* Mevcut görselin önizlemesi */}
                                      <img src={editingPost.imageUrl.startsWith('http') ? editingPost.imageUrl : `${STATIC_FILES_DOMAIN}${editingPost.imageUrl}`} alt="Mevcut görsel" className="h-16 w-16 object-cover rounded"/>
                                      <div className="flex items-center space-x-2">
                                          <Checkbox id="removeCurrentImage" checked={removeCurrentImage} onCheckedChange={(checked) => setRemoveCurrentImage(checked as boolean)} />
                                          <Label htmlFor="removeCurrentImage" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Mevcut resmi kaldır</Label>
                                      </div>
                                  </div>
                              )}
                               {formImageFile && (
                                  <div className="mt-2">
                                      <p className="text-sm text-muted-foreground dark:text-gray-400">Önizleme:</p>
                                      <img src={URL.createObjectURL(formImageFile)} alt="Seçilen görsel önizlemesi" className="mt-1 max-h-40 rounded-md border object-contain dark:border-gray-700"/>
                                  </div>
                              )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                              <Button type="submit" disabled={formSubmitting} className="w-full sm:w-auto">
                                  {formSubmitting ? (editingPost ? "Güncelleniyor..." : "Ekleniyor...") : (editingPost ? "Yazıyı Güncelle" : "Yazıyı Ekle")}
                              </Button>
                              {editingPost && (
                                  <Button type="button" variant="outline" onClick={resetForm} disabled={formSubmitting} className="w-full sm:w-auto dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                                      İptal
                                  </Button>
                              )}
                          </div>
                          {formError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formError}</p>}
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  <h3 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
                    Son Yazılar
                  </h3>
                  {isLoading && posts.length === 0 && <p className="text-center text-gray-600 dark:text-gray-400 py-8">Yazılar yükleniyor...</p>}
                  {!isLoading && error && posts.length === 0 && <p className="text-center text-red-500 dark:text-red-400 py-8">{error}</p>}
                  {!isLoading && !error && posts.length === 0 && <p className="text-center text-gray-600 dark:text-gray-400 py-8">Henüz hiç blog yazısı yok.</p>}

                  <div className="space-y-8">
                    {/* Blog Yazı Kartları */}
                    {postsForCards.map((cardPost) => {
                      const originalPost = posts.find(p => p._id === cardPost._id);
                       // Yetki kontrolü: Yazının sahibi veya admin ise düzenleme/silme gör
                       // originalPost.author populate edilmiş obje olduğu için typeof kontrolüne gerek yok
                      const isAuthor = userInfo && originalPost?.author && typeof originalPost.author === 'object' && originalPost.author._id === userInfo._id;
                      const isAdmin = userInfo?.role === 'admin';

                      return (
                          <div key={cardPost._id} className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border dark:border-gray-700 overflow-hidden">
                              {/* Kart içeriği */}
                              <div className="flex flex-col sm:flex-row">
                                  <div className="sm:w-1/3 aspect-[16/9] sm:aspect-auto overflow-hidden bg-muted flex-shrink-0">
                                      {/* Blog kartı resmi - postsForCards içinde URL doğru oluşturuldu */}
                                      <img
                                          src={cardPost.image}
                                          alt={cardPost.title}
                                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                          onError={(e) => {
                                            console.warn("Blog kart resmi yüklenemedi:", (e.target as HTMLImageElement).src, "-> Varsayılan resme geçiliyor.");
                                            (e.target as HTMLImageElement).onerror = null; // Sonsuz döngüyü engelle
                                            (e.target as HTMLImageElement).src = '/default-blog.png'; // Varsayılan resminizin yolu (public klasöründe olmalı)
                                            (e.target as HTMLImageElement).classList.add('object-contain'); // Placeholder için stil ayarı
                                          }}
                                      />
                                  </div>
                                  <div className="sm:w-2/3 p-5 flex flex-col justify-between flex-grow">
                                      <div>
                                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                                              <Calendar className="mr-1.5 h-4 w-4" /><span>{cardPost.date}</span>
                                              {/* Yazar bilgisi varsa göster */}
                                              {/* cardPost.authorId zaten populate edilmiş objeden geldiği için her zaman olmalı */}
                                                <div className="flex items-center ml-4">
                                                  {/* Yazar Avatarı (varsa) */}
                                                  {cardPost.authorAvatar ? (
                                                     <Avatar className="h-6 w-6 mr-1.5">
                                                        {/* Avatar URL'si tam veya /uploads/... şeklinde gelebilir */}
                                                        <AvatarImage src={cardPost.authorAvatar.startsWith('http') ? cardPost.authorAvatar : `${STATIC_FILES_DOMAIN}${cardPost.authorAvatar.startsWith('/') ? cardPost.authorAvatar : '/' + cardPost.authorAvatar}`} alt={cardPost.author} />
                                                        <AvatarFallback>{cardPost.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                     </Avatar>
                                                  ) : (
                                                      <UserIcon className="mr-1.5 h-4 w-4" /> // Avatar yoksa User ikonu
                                                  )}
                                                  <span>{cardPost.author}</span> {/* <-- Yazar adı burada gösteriliyor */}
                                                </div>

                                          </div>
                                          <h3 className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors line-clamp-2 h-[3rem] break-words">
                                              {/* Yazı başlığı linki */}
                                              <Link to={cardPost.link}>{cardPost.title}</Link>
                                          </h3>
                                          {/* Kategori bilgisini kartta göstermek istemiyorsanız buradan kaldırabilirsiniz */}
                                          {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kategori: {cardPost.category}</p> */}
                                          <p className="text-muted-foreground text-sm line-clamp-3 break-words">{cardPost.excerpt}</p>
                                      </div>
                                       {/* Daha fazla oku butonu veya linki */}
                                       <div className="mt-4">
                                           <Button variant="link" asChild className="px-0 justify-start h-auto py-0 text-sm">
                                              <Link to={cardPost.link}>Daha Fazla Oku <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4"><path d="m9 18 6-6-6-6"/></svg></Link>
                                           </Button>
                                       </div>
                                  </div>
                              </div>

                              {/* Düzenleme ve Silme Butonları */}
                              {/* Yetki kontrolü: isAuthor veya isAdmin */}
                              {(isAdmin || isAuthor) && (
                                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 dark:bg-gray-700/80 p-1 rounded-md z-10">
                                      <Button variant="outline" size="sm" onClick={() => originalPost && handleEditClick(originalPost)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                                          <Edit className="h-4 w-4" />
                                      </Button>
                                      <AlertDialogTrigger asChild>
                                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(cardPost._id)}>
                                          <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </AlertDialogTrigger>
                                  </div>
                              )}
                          </div>
                      );
                    })}
                  </div>
                  {/* Pagination bileşeni burada kalır eğer ihtiyacınız varsa */}
                  {/* {posts.length > 5 && <BlogPagination />} */}
                </div>
                {/* BlogSidebar kaldırıldı */}
              {/* </div> */} {/* Dış sarmalayıcı flex div'i de kaldırılabilir veya uygun hale getirilebilir */}
          </div>
          {/* AlertDialog Content here */}
          <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <AlertDialogHeader>
                  <AlertDialogTitle className="dark:text-gray-100">Silmek istediğinize emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription className="dark:text-gray-400">
                      "{posts.find(p=>p._id === deletingPostId)?.title || 'Bu'}" blog yazısı kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessingDelete} onClick={() => {setIsDeleteDialogOpen(false); setDeletingPostId(null);}} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeletePost} disabled={isProcessingDelete} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                      {isProcessingDelete ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Siliniyor...</> : "Evet, Sil"}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </section>
    </AlertDialog>
  );
};

export default BlogSection;