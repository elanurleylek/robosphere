// src/pages/Blog.tsx
import React, { useEffect, useState, FormEvent, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPostComponent from '@/components/blog/BlogPost';
import BlogHero from '@/components/blog/BlogHero';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPagination from '@/components/blog/BlogPagination';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { blogApi, STATIC_FILES_DOMAIN } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth'; 
import { Trash2, Edit } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { BlogPost as BlogPostType, BlogPostAuthor, BlogCreatePayload, BlogUpdatePayload } from '@/lib/types'; // Payload tipleri eklendi

export interface BlogPostCardData {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  authorId?: string;
  date: string;
  category: string;
  image: string;
  link: string;
}

export interface SidebarPostData {
  _id: string;
  title: string;
  date: string;
  image: string;
  link: string;
}

const categories = [
  { name: "Eğitim", count: 0, slug: "egitim" },
  { name: "Teknoloji", count: 0, slug: "teknoloji" },
  { name: "Projeler", count: 0, slug: "projeler" },
  { name: "Genel", count: 0, slug: "genel" },
];

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formTags, setFormTags] = useState(''); // Virgülle ayrılmış string
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);

  const { userInfo } = useAuth();
  const { toast } = useToast();

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await blogApi.getAll();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Blogları çekerken hata:", err);
      setError(err instanceof Error ? err.message : 'Bloglar yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormCategory('');
    setFormTags('');
    setFormImageFile(null);
    setRemoveCurrentImage(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
    setFormError(null);
    setEditingPost(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormImageFile(e.target.files[0]);
      setRemoveCurrentImage(false);
    } else {
      setFormImageFile(null);
    }
  };

  const handleEditClick = (postToEdit: BlogPostType) => {
    setEditingPost(postToEdit);
    setFormTitle(postToEdit.title);
    setFormContent(postToEdit.content);
    setFormCategory(postToEdit.category || '');
    setFormTags(postToEdit.tags ? postToEdit.tags.join(', ') : '');
    setFormImageFile(null);
    setRemoveCurrentImage(false);
    if (imageInputRef.current) imageInputRef.current.value = "";

    const formCard = document.getElementById("blog-form-card");
    if (formCard) formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddOrUpdateBlogPost = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formTitle.trim() || !formContent.trim()) {
      setFormError('Başlık ve içerik alanları zorunludur.');
      toast({ title: "Eksik Bilgi", description: "Başlık ve içerik alanları zorunludur.", variant: "destructive" });
      return;
    }
    if (!userInfo?.token) {
      setFormError('Bu işlemi yapmak için giriş yapmalısınız.');
      toast({ title: "Yetkilendirme Hatası", description: "Lütfen giriş yapın.", variant: "destructive" });
      return;
    }
    setFormSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', formTitle);
    formData.append('content', formContent);
    if (formCategory.trim()) formData.append('category', formCategory);
    
    const tagsArray = formTags.trim() ? formTags.trim().split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    if (tagsArray.length > 0) {
        tagsArray.forEach(tag => {
            formData.append('tags', tag); // Backend'inize göre 'tags[]' olabilir
        });
    }
    
    const excerptValue = formContent.substring(0, 150) + (formContent.length > 150 ? '...' : '');
    formData.append('excerpt', excerptValue);

    if (formImageFile) {
      formData.append('image', formImageFile, formImageFile.name);
    } else if (editingPost && removeCurrentImage && editingPost.imageUrl) {
      formData.append('removeImage', 'true');
    }
    
    try {
      let messageTitle = '';
      let messageDescription = '';

      if (editingPost) {
        if (!editingPost._id) throw new Error("Düzenlenecek yazı ID'si bulunamadı.");
        // Eğer backend JSON bekliyorsa payload oluşturulmalı, FormData ise direkt gönderilmeli.
        // api.ts'deki blogApi.update hem FormData hem JSON alabiliyor.
        const updatedPost = await blogApi.update(editingPost._id, formData) as BlogPostType;
        setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
        messageTitle = "Başarıyla Güncellendi!";
        messageDescription = `"${updatedPost.title}" adlı yazı güncellendi.`;
      } else {
        const newPost = await blogApi.create(formData) as BlogPostType;
        setPosts(prevPosts => [newPost, ...prevPosts]);
        messageTitle = "Başarıyla Eklendi!";
        messageDescription = `"${newPost.title}" adlı yazı sisteme eklendi.`;
      }
      toast({ title: messageTitle, description: messageDescription });
      resetForm();
      fetchBlogPosts();
    } catch (err) {
      console.error("Blog ekleme/güncelleme hatası:", err);
      const errorMessage = err instanceof Error ? err.message : 'İşlem sırasında bir hata oluştu.';
      setFormError(errorMessage);
      toast({ title: "Hata Oluştu", description: errorMessage, variant: "destructive" });
    } finally {
      setFormSubmitting(false);
    }
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
      console.error("Blog silme hatası:", err);
      const errorMessage = err instanceof Error ? err.message : 'Blog yazısı silinemedi.';
      toast({ title: "Silme Başarısız", description: errorMessage, variant: "destructive" });
    } finally {
      setIsProcessingDelete(false);
      setIsDeleteDialogOpen(false);
      setDeletingPostId(null);
    }
  };

  const getAuthorDetails = (authorData: BlogPostType['author']): { id?: string; name: string } => {
    if (!authorData) return { name: 'Bilinmiyor' };
    if (typeof authorData === 'string') {
        return { id: authorData, name: `Yazar ID: ${authorData.substring(0,6)}...` };
    }
    return { id: authorData._id, name: authorData.username };
  };
  
  const postsForCards: BlogPostCardData[] = posts.map((post) => {
    const authorDetails = getAuthorDetails(post.author);
    let displayImageUrl = `https://via.placeholder.com/400x200?text=${encodeURIComponent(post.title.substring(0,10) || 'Görsel')}`;
    if (post.imageUrl) {
        displayImageUrl = post.imageUrl.startsWith('http') ? post.imageUrl : `${STATIC_FILES_DOMAIN}${post.imageUrl}`;
    }
    return {
        _id: post._id,
        title: post.title,
        excerpt: post.excerpt || (post.content ? post.content.substring(0, 120) + '...' : 'Özet yok.'),
        author: authorDetails.name,
        authorId: authorDetails.id,
        date: post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tarih Yok',
        category: post.category || 'Genel',
        image: displayImageUrl,
        link: `/blog/${post._id}`,
    };
  });
  
  const postsForSidebar: SidebarPostData[] = postsForCards.slice(0, 5).map(p => ({
      _id: p._id, title: p.title, date: p.date, image: p.image, link: p.link
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        <BlogHero />
        <section className="py-12">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="lg:w-2/3">
                {userInfo?.role === 'admin' && (
                  <Card id="blog-form-card" className="mb-12 p-4 sm:p-6 shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}
                      </CardTitle>
                      {editingPost && <CardDescription className="dark:text-gray-400">"{editingPost.title}" başlıklı yazıyı düzenliyorsunuz.</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddOrUpdateBlogPost} className="space-y-4 sm:space-y-6">
                        <div><Label htmlFor="blogTitle" className="text-gray-700 dark:text-gray-300">Başlık</Label><Input id="blogTitle" value={formTitle} onChange={e => setFormTitle(e.target.value)} required className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                        <div><Label htmlFor="blogContent" className="text-gray-700 dark:text-gray-300">İçerik</Label><Textarea id="blogContent" value={formContent} onChange={e => setFormContent(e.target.value)} rows={8} required className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div><Label htmlFor="blogCategory" className="text-gray-700 dark:text-gray-300">Kategori</Label><Input id="blogCategory" value={formCategory} onChange={e => setFormCategory(e.target.value)} placeholder="örn: Teknoloji" className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                            <div><Label htmlFor="blogTags" className="text-gray-700 dark:text-gray-300">Etiketler (virgülle ayırın)</Label><Input id="blogTags" value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="örn: react, javascript" className="bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"/></div>
                        </div>
                        <div>
                            <Label htmlFor="blogImageFile" className="text-gray-700 dark:text-gray-300">Görsel Yükle</Label>
                            <Input id="blogImageFile" type="file" accept="image/*" onChange={handleImageFileChange} ref={imageInputRef} className="text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800 cursor-pointer"/>
                            {editingPost && editingPost.imageUrl && !formImageFile && (
                                <div className="mt-3 flex items-center space-x-3 p-2 border rounded-md dark:border-gray-700">
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
                
                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 mt-12">
                  Son Yazılar
                </h2>
                {isLoading && posts.length === 0 && <p className="text-center text-gray-600 dark:text-gray-400 py-8">Yazılar yükleniyor...</p>}
                {!isLoading && error && posts.length === 0 && <p className="text-center text-red-500 dark:text-red-400 py-8">{error}</p>}
                {!isLoading && !error && posts.length === 0 && <p className="text-center text-gray-600 dark:text-gray-400 py-8">Henüz hiç blog yazısı yok.</p>}

                <div className="space-y-8">
                  {postsForCards.map((cardPost) => {
                    const originalPost = posts.find(p => p._id === cardPost._id);
                    const isAuthor = userInfo && originalPost && typeof originalPost.author === 'object' && originalPost.author._id === userInfo._id;
                    const isAdmin = userInfo?.role === 'admin';

                    return (
                        <div key={cardPost._id} className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border dark:border-gray-700 overflow-hidden">
                            <BlogPostComponent post={cardPost} />
                            {(isAdmin || (userInfo?.token && isAuthor)) && (
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 dark:bg-gray-700/80 p-1 rounded-md">
                                    <Button variant="outline" size="sm" onClick={() => originalPost && handleEditClick(originalPost)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog open={isDeleteDialogOpen && deletingPostId === cardPost._id} onOpenChange={(open) => { if(!open && deletingPostId === cardPost._id) { setDeletingPostId(null); setIsDeleteDialogOpen(false); }}}>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(cardPost._id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      {/* AlertDialogContent'i global state ile yöneteceğiz */}
                                    </AlertDialog>
                                </div>
                            )}
                        </div>
                    );
                  })}
                </div>
                {posts.length > 5 && <BlogPagination />}
              </div>
              <BlogSidebar
                categories={categories}
                popularPosts={postsForSidebar}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Genel Silme Onay Dialog'u */}
      <AlertDialog open={isDeleteDialogOpen && deletingPostId !== null} onOpenChange={(open) => { if(!open) { setDeletingPostId(null); setIsDeleteDialogOpen(false); }}}>
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
                    {isProcessingDelete ? "Siliniyor..." : "Evet, Sil"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
};

export default Blog;