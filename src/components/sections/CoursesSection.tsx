// src/components/sections/CoursesSection.tsx
'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Dialog ve AlertDialog importları burada kalmalı, çünkü state'leri burada yönetiliyor
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowRight, Search, Cpu, CircuitBoard, Microchip, Cog, Trash2, Edit, Loader2, PlusCircle } from 'lucide-react';
import { useToast as useShadcnToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { Course, CourseCreatePayload, CourseUpdatePayload, ApiError } from '@/lib/types';
import { courseApi, STATIC_FILES_DOMAIN } from '@/lib/api';

const courseCategories = [
  { name: 'Robotik Temel', count: 0, icon: Cpu },
  { name: 'Arduino', count: 0, icon: CircuitBoard },
  { name: 'Raspberry Pi', count: 0, icon: Microchip },
  { name: 'Sensörler', count: 0, icon: Cog },
];

const CoursesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [courseFormData, setCourseFormData] = useState<Partial<CourseCreatePayload & { _id?: string }>>({
    title: '', description: '', instructor: '', duration: undefined, category: '', imageUrl: null, price: null, level: "Belirtilmemiş",
  });
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const { userInfo } = useAuth();
  const { toast } = useShadcnToast();

  const fetchCourses = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await courseApi.getAll(); setCourses(data || []); }
    catch (err) { const apiErr = err as ApiError; console.error("Error fetching courses:", apiErr.details || apiErr.message || err); setError(apiErr.message || 'Kurslar yüklenemedi.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  useEffect(() => { if (!isModalOpen) { resetForm(); } }, [isModalOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleCategoryClick = (categoryName: string) => setActiveCategory(prev => prev === categoryName ? null : categoryName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      const type = target.type;

      setCourseFormData(prev => {
        let parsedValue: string | number | null | undefined = value;
        if (type === 'number') {
          if (value === '') { parsedValue = name === 'price' ? null : undefined; }
          else {
            parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) { parsedValue = name === 'price' ? null : undefined; }
          }
        }
        return { ...prev, [name]: parsedValue };
      });
  };

  const handleLevelChange = (value: string) => { setCourseFormData(prev => ({...prev, level: value as CourseCreatePayload['level'] })); };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCourseImageFile(e.target.files[0]); setCourseFormData(prev => ({ ...prev, imageUrl: '' })); setRemoveCurrentImage(false);
    } else {
      setCourseImageFile(null);
      if (editingCourse && !removeCurrentImage && editingCourse.imageUrl) { setCourseFormData(prev => ({ ...prev, imageUrl: editingCourse.imageUrl })); }
    }
  };
  const resetForm = () => {
    setEditingCourse(null);
    setCourseFormData({ title: '', description: '', instructor: '', duration: undefined, category: '', imageUrl: null, price: null, level: "Belirtilmemiş", });
    setCourseImageFile(null); setRemoveCurrentImage(false); if (imageInputRef.current) imageInputRef.current.value = ""; setFormError(null); setSubmitting(false);
  };
  const handleEditClick = (course: Course) => {
    resetForm(); setEditingCourse(course);
    setCourseFormData({ _id: course._id, title: course.title || '', description: course.description || '', instructor: course.instructor || '', duration: course.duration ?? undefined, category: course.category || '', imageUrl: course.imageUrl || null, price: course.price ?? null, level: course.level ?? "Belirtilmemiş", });
    setIsModalOpen(true);
  };

  // handleDeleteClick ve confirmDeleteCourse Dialog state'ini yönettiği için burada kalmalı
  const handleDeleteClick = (courseId: string) => {
    setDeletingCourseId(courseId);
    setIsDeleteDialogOpen(true); // AlertDialog'u aç
  };

  const confirmDeleteCourse = async () => {
    if (!deletingCourseId || !userInfo?.token) return;
    setIsProcessingDelete(true);
    try {
      await courseApi.delete(deletingCourseId);
      toast({ title: 'Başarılı', description: 'Kurs başarıyla silindi.' });
      setCourses(prev => prev.filter(course => course._id !== deletingCourseId));
    } catch (err) {
      const apiErr = err as ApiError;
      toast({ title: 'Silme Başarısız', description: apiErr.message || 'Kurs silinirken bir hata oluştu.', variant: 'destructive' });
    } finally {
      setIsProcessingDelete(false);
      setIsDeleteDialogOpen(false); // AlertDialog'u kapat
      setDeletingCourseId(null);
    }
  };

  const handleAddOrUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(null);
    if (!courseFormData.title?.trim() || !courseFormData.description?.trim() || !courseFormData.instructor?.trim() || !courseFormData.category?.trim()) { setFormError('Lütfen tüm zorunlu alanları doldurun.'); toast({ title: "Eksik Bilgi", description: 'Başlık, Açıklama, Eğitmen ve Kategori zorunludur.', variant: 'destructive' }); return; }
    if (courseFormData.duration !== undefined && (typeof courseFormData.duration !== 'number' || courseFormData.duration <= 0)) { setFormError('Süre geçerli bir sayı olmalı ve 0\'dan büyük olmalıdır.'); toast({ title: "Geçersiz Süre", description: 'Süre pozitif bir sayı olmalıdır.', variant: 'destructive' }); return; }
    if (courseFormData.price !== null && courseFormData.price !== undefined && (typeof courseFormData.price !== 'number' || courseFormData.price < 0)) { setFormError('Fiyat geçerli bir sayı olmalı ve 0 veya daha büyük olmalıdır.'); toast({ title: "Geçersiz Fiyat", description: 'Fiyat pozitif bir sayı veya 0 olmalıdır.', variant: 'destructive' }); return; }
    if (!userInfo?.token) { setFormError('Bu işlemi yapmak için giriş yapmalısınız.'); toast({ title: "Yetkilendirme Hatası", description: 'Lütfen giriş yapın.', variant: 'destructive' }); return; }
    setSubmitting(true);
    let resolvedImageUrl: string | null | undefined = courseFormData.imageUrl;
     if (courseImageFile) {
       const uploadFormData = new FormData(); uploadFormData.append('image', courseImageFile); const headers: HeadersInit = {}; if (userInfo.token) { headers['Authorization'] = `Bearer ${userInfo.token}`; }
       try {
         const uploadResponse = await fetch(`${STATIC_FILES_DOMAIN}/api/upload`, { method: 'POST', body: uploadFormData, headers: headers, });
         if (!uploadResponse.ok) { const errorData = await uploadResponse.json().catch(() => ({ message: `HTTP ${uploadResponse.status}` })); throw new Error(errorData.message || `Resim yüklenemedi (Durum: ${uploadResponse.status})`); }
         const uploadData = await uploadResponse.json(); if (!uploadData.imageUrl) { throw new Error('Resim yüklendi ancak URL alınamadı.'); }
         resolvedImageUrl = uploadData.imageUrl;
       } catch (uploadError) { const errMsg = uploadError instanceof Error ? uploadError.message : 'Bilinmeyen bir resim yükleme hatası.'; setFormError(`Resim yükleme hatası: ${errMsg}`); toast({ title: "Resim Yükleme Başarısız", description: errMsg, variant: 'destructive' }); setSubmitting(false); return; }
     } else { if (editingCourse) { resolvedImageUrl = removeCurrentImage ? null : courseFormData.imageUrl; if (!removeCurrentImage && courseFormData.imageUrl === null && editingCourse.imageUrl) { resolvedImageUrl = editingCourse.imageUrl; } } else { resolvedImageUrl = courseFormData.imageUrl || undefined; } }
    const payloadBase = {
      title: courseFormData.title!.trim(), description: courseFormData.description!.trim(), instructor: courseFormData.instructor!.trim(),
      category: courseFormData.category!.trim(), imageUrl: resolvedImageUrl,
      ...(courseFormData.duration !== undefined && { duration: courseFormData.duration as number }),
      ...(courseFormData.price !== undefined && { price: courseFormData.price }), level: courseFormData.level || "Belirtilmemiş",
    };
    try {
      let resultCourse: Course;
      if (editingCourse && editingCourse._id) {
        const updatePayload: CourseUpdatePayload = payloadBase; resultCourse = await courseApi.update(editingCourse._id, updatePayload); setCourses(prev => prev.map(c => c._id === resultCourse._id ? resultCourse : c)); toast({ title: 'Başarıyla Güncellendi!', description: `"${resultCourse.title}" güncellendi.` });
      } else {
        const createPayload: CourseCreatePayload = payloadBase as CourseCreatePayload; resultCourse = await courseApi.create(createPayload); setCourses(prev => [resultCourse, ...prev]); toast({ title: 'Başarıyla Eklendi!', description: `"${resultCourse.title}" eklendi.` });
      }
      setIsModalOpen(false);
    } catch (err) { const apiErr = err as ApiError; setFormError(`API Hatası: ${apiErr.message || 'Bilinmeyen bir hata'}`); toast({ title: "İşlem Başarısız", description: apiErr.message || 'Bilinmeyen bir hata', variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const displayedCourses = useMemo((): Course[] => {
     if (!Array.isArray(courses)) return []; let filtered = courses;
     if (activeCategory) { filtered = filtered.filter(course => course.category === activeCategory); }
     if (searchQuery) { const query = searchQuery.toLowerCase(); filtered = filtered.filter(course => course.title.toLowerCase().includes(query) || (course.description && course.description.toLowerCase().includes(query)) || course.instructor.toLowerCase().includes(query) || (course.category && course.category.toLowerCase().includes(query))); }
     return filtered;
  }, [courses, searchQuery, activeCategory]);

  const dynamicCourseCategories = useMemo(() => {
    if (!Array.isArray(courses)) return courseCategories.map(cat => ({ ...cat, count: 0 }));
    return courseCategories.map(cat => ({ ...cat, count: courses.filter(course => course.category === cat.name).length }));
  }, [courses]);

  const imagePreviewUrl = useMemo(() => {
     if (courseImageFile) return URL.createObjectURL(courseImageFile);
     if (removeCurrentImage) return null;
     if (courseFormData.imageUrl) {
        return courseFormData.imageUrl.startsWith('http') || courseFormData.imageUrl.startsWith('/')
              ? courseFormData.imageUrl : `${STATIC_FILES_DOMAIN}${courseFormData.imageUrl}`;
     }
     return null;
  }, [courseImageFile, courseFormData.imageUrl, removeCurrentImage]);


  return (
    // Ana içerik bölümü. Buna anasayfada hedeflemek için bir ID verelim.
    // Orijinal main veya dış section'ın arkaplan ve padding stilleri buraya geldi.
    // AlertDialog'un burada kalması gerekiyor çünkü state'i (isDeleteDialogOpen) bu component'te yönetiliyor.
    // AlertDialog componentini return ifadesinin en dışında, diğer her şeyi kapsayacak şekilde sarıyoruz.
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <section id="courses-section" className="py-12 bg-muted/20 dark:bg-muted/5">
          <div className="container px-6 mx-auto">
              {/* Başlık ve Arama Bölümü */}
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Robotik Eğitim Kursları</h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                      Her seviyeye uygun, uygulamalı robotik eğitimlerimizle geleceğin teknolojilerini keşfedin.
                  </p>
                  <div className="max-w-xl mx-auto relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                      placeholder="Kurs adı, eğitmen, içerik veya kategori ara..."
                      className="pl-12 h-12 rounded-lg shadow-sm w-full"
                      value={searchQuery}
                      onChange={handleSearch}
                      />
                  </div>
              </div>

              {/* Kurs Kategorileri Bölümü */}
              <div className="py-8">
                <h3 className="text-3xl font-semibold mb-8 text-center text-foreground">Kurs Kategorileri</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                  {dynamicCourseCategories.map((category) => (
                    <button
                      key={category.name}
                      className={cn(
                        "bg-card border rounded-lg p-4 text-center hover:shadow-lg transition-all flex flex-col items-center justify-center aspect-[3/2] sm:aspect-square",
                        activeCategory === category.name ? 'border-primary ring-2 ring-primary ring-offset-background ring-offset-2' : 'border-border hover:border-primary/50'
                      )}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className={cn("p-3 rounded-full bg-primary/10 text-primary mb-3 transition-colors", activeCategory === category.name && "bg-primary text-primary-foreground")}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-medium text-sm md:text-base text-foreground">{category.name}</h4>
                      <span className="text-xs text-muted-foreground mt-1">{category.count} kurs</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tüm Kurslar Listesi Bölümü */}
              <div className="py-8 bg-muted/20 dark:bg-muted/5">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                  <h3 className="text-3xl font-semibold text-foreground text-center sm:text-left">Tüm Kurslar</h3>
                  {userInfo?.token && (
                    // Dialog wrapper remains here
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      {/* Dialog Trigger inside the Dialog */}
                      <DialogTrigger asChild>
                        <Button variant="default" className="w-full sm:w-auto" type="button" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Kurs Ekle
                        </Button>
                      </DialogTrigger>
                      {/* Dialog Content inside the Dialog */}
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{editingCourse ? 'Kursu Düzenle' : 'Yeni Kurs Ekle'}</DialogTitle>
                          <DialogDescription>
                            Kurs detaylarını girin. <span className="text-red-500">*</span> ile işaretli alanlar zorunludur.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddOrUpdateCourse} className="grid gap-4 py-4 text-sm">
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="title" className="text-right col-span-4 sm:col-span-1">Başlık <span className="text-red-500">*</span></Label> <Input id="title" name="title" value={courseFormData.title || ''} onChange={handleInputChange} className="col-span-4 sm:col-span-3" required /> </div>
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="description" className="text-right col-span-4 sm:col-span-1">Açıklama <span className="text-red-500">*</span></Label> <Textarea id="description" name="description" value={courseFormData.description || ''} onChange={handleInputChange} className="col-span-4 sm:col-span-3" required rows={3} /> </div>
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="instructor" className="text-right col-span-4 sm:col-span-1">Eğitmen <span className="text-red-500">*</span></Label> <Input id="instructor" name="instructor" value={courseFormData.instructor || ''} onChange={handleInputChange} className="col-span-4 sm:col-span-3" required /> </div>
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="duration" className="text-right col-span-4 sm:col-span-1">Süre (Saat)</Label> <Input id="duration" name="duration" type="number" value={courseFormData.duration ?? ''} onChange={handleInputChange} className="col-span-4 sm:col-span-3" min="0" /> </div>
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="category" className="text-right col-span-4 sm:col-span-1">Kategori <span className="text-red-500">*</span></Label> <Input id="category" name="category" value={courseFormData.category || ''} onChange={handleInputChange} className="col-span-4 sm:col-span-3" required placeholder="örn: Arduino, Robotik Temel" /> </div>
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="price" className="text-right col-span-4 sm:col-span-1">Fiyat (₺)</Label> <Input id="price" name="price" type="number" value={courseFormData.price ?? ''} onChange={handleInputChange} className="col-span-4 sm:col-span-3" placeholder="Ücretsizse boş veya 0 girin" step="0.01" min="0"/> </div>
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="level" className="text-right col-span-4 sm:col-span-1">Seviye</Label> <Select value={courseFormData.level || "Belirtilmemiş"} onValueChange={handleLevelChange}> <SelectTrigger className="col-span-4 sm:col-span-3"> <SelectValue placeholder="Seviye Seçin" /> </SelectTrigger> <SelectContent>  <SelectItem value="Belirtilmemiş">Seviye Yok / Belirtilmemiş</SelectItem> <SelectItem value="Başlangıç">Başlangıç</SelectItem> <SelectItem value="Orta Seviye">Orta Seviye</SelectItem> <SelectItem value="İleri Seviye">İleri Seviye</SelectItem> <SelectItem value="Tüm Seviyeler">Tüm Seviyeler</SelectItem> </SelectContent> </Select> </div>
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="courseImageFile" className="text-right col-span-4 sm:col-span-1">Görsel Yükle</Label> <Input id="courseImageFile" type="file" accept="image/*" onChange={handleImageFileChange} ref={imageInputRef} className="col-span-4 sm:col-span-3 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" disabled={!!courseFormData.imageUrl && !courseImageFile && !removeCurrentImage} /> </div>
                          {imagePreviewUrl && ( <div className="grid grid-cols-4 items-start gap-x-4 gap-y-2"> <div className="col-start-1 sm:col-start-2 col-span-4 sm:col-span-3 flex flex-col sm:flex-row items-center gap-2"> <img src={imagePreviewUrl} alt="Görsel Önizleme" className="max-h-24 w-auto rounded-md border object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/100x60?text=Görsel+Yok`; }} /> {editingCourse && editingCourse.imageUrl && !courseImageFile && ( <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4"> <Checkbox id="removeCurrentImage" checked={removeCurrentImage} onCheckedChange={(checked) => { const isChecked = checked as boolean; setRemoveCurrentImage(isChecked); if (isChecked) { setCourseImageFile(null); setCourseFormData(prev => ({ ...prev, imageUrl: null })); if (imageInputRef.current) imageInputRef.current.value = ""; } else { if (editingCourse && editingCourse.imageUrl) setCourseFormData(prev => ({...prev, imageUrl: editingCourse.imageUrl})); } }} /> <Label htmlFor="removeCurrentImage" className="text-xs text-muted-foreground cursor-pointer">Mevcut resmi kaldır</Label> </div> )} </div> </div> )}
                          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> <Label htmlFor="imageUrl" className="text-right col-span-4 sm:col-span-1">veya Görsel URL</Label> <Input id="imageUrl" name="imageUrl" type="url" value={courseFormData.imageUrl || ''} onChange={handleInputChange} className="col-span-4 sm:col-span-3" placeholder="https://..." disabled={!!courseImageFile || removeCurrentImage} /> </div>
                          {formError && <p className="col-span-full text-center text-sm text-red-600 dark:text-red-400 pt-2">{formError}</p>}
                          <DialogFooter className="col-span-full pt-4"> <DialogClose asChild><Button type="button" variant="outline">İptal</Button></DialogClose> <Button type="submit" disabled={submitting}> {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {editingCourse ? (submitting ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet') : (submitting ? 'Ekleniyor...' : 'Kursu Ekle')} </Button> </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {loading && ( <div className="text-center py-10 text-muted-foreground"> <Loader2 className="h-8 w-8 animate-spin inline-block mb-2" /> <p>Kurslar yükleniyor...</p> </div> )}
                {!loading && error && ( <div className="text-center py-10 text-destructive"> <p className="font-semibold mb-2">Bir sorun oluştu!</p> <p className="text-sm">{error}</p> <Button variant="outline" onClick={fetchCourses} className="mt-4">Tekrar Dene</Button> </div> )}
                {!loading && !error && displayedCourses.length === 0 && ( <div className="text-center py-10"> <p className="text-muted-foreground text-lg"> {searchQuery || activeCategory ? 'Bu kriterlere uygun kurs bulunamadı.' : 'Henüz hiç kurs eklenmemiş.'} </p> {!searchQuery && !activeCategory && !userInfo?.token && ( <p className="text-sm text-muted-foreground mt-2">Kurs eklemek için giriş yapmanız gerekebilir.</p> )} {!searchQuery && !activeCategory && userInfo?.token && ( <Button variant="link" onClick={() => { resetForm(); setIsModalOpen(true); }} className="mt-2">İlk kursunuzu ekleyin!</Button> )} </div> )}
                {!loading && !error && displayedCourses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedCourses.map(course => (
                      <div key={course._id} className="bg-card rounded-xl overflow-hidden shadow-md border border-border h-full flex flex-col hover:shadow-xl hover:border-primary/30 transition-all duration-300 group relative">
                        <img
                          src={course.imageUrl ? (course.imageUrl.startsWith('http') ? course.imageUrl : `${STATIC_FILES_DOMAIN}${course.imageUrl}`) : `${STATIC_FILES_DOMAIN}/default-course.png`}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 aspect-[16/10]"
                          onError={(e) => {
                            console.warn("Kurs listesi resmi yüklenemedi:", (e.target as HTMLImageElement).src, "-> Varsayılan resme geçiliyor.");
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = `${STATIC_FILES_DOMAIN}/default-course.png`;
                          }}
                        />
                        <Link to={`/courses/${course._id}`} className="absolute inset-0 z-10"></Link>

                        <div className="p-4 flex flex-col flex-grow">
                          <Link to={`/courses/${course._id}`} className="block"> <h4 className="text-md font-semibold mb-2 text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight h-[2.75em]">{course.title}</h4> </Link>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed h-[2.5em]">{course.description || 'Açıklama bulunmuyor.'}</p>
                          <div className="mt-auto text-xs text-muted-foreground pt-3 border-t border-border/50 space-y-1"> {course.instructor && <p>Eğitmen: <span className="font-medium text-foreground">{course.instructor}</span></p>} {course.duration && <p>Süre: <span className="font-medium text-foreground">{course.duration} saat</span></p>} {course.category && <p>Kategori: <span className="font-medium text-foreground">{course.category}</span></p>} </div>
                        </div>
                        {userInfo?.token && (
                           <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/80 backdrop-blur-sm p-1 rounded-md z-10">
                             <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleEditClick(course); }} className="h-7 w-7"> <Edit className="h-3.5 w-3.5" /> </Button>
                             {/* AlertDialog Trigger is inside the AlertDialog wrapper, which is correct */}
                             <AlertDialogTrigger asChild>
                               <Button variant="destructive" size="icon" type="button" onClick={(e) => { e.stopPropagation(); handleDeleteClick(course._id); }} className="h-7 w-7">
                                 <Trash2 className="h-3.5 w-3.5" />
                               </Button>
                             </AlertDialogTrigger>
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="py-8 bg-gradient-to-t from-primary/10 to-background">
                  <div className="text-center">
                      <h3 className="text-3xl font-bold mb-4 text-foreground">Hayalinizdeki Robotiğe Başlayın</h3>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"> Uygulamalı eğitimlerimizle robotik alanında bilgi ve becerilerinizi geliştirin. </p>
                      <Link to="/register"> <Button size="lg" className="group shadow-lg hover:shadow-primary/30 transition-shadow"> Hemen Kayıt Ol <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /> </Button> </Link>
                  </div>
              </div>
          </div>
          {/* AlertDialog Content is inside the AlertDialog wrapper, which is correct */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kursu Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
              <AlertDialogDescription> Bu işlem geri alınamaz. "{courses.find(c=>c._id === deletingCourseId)?.title || 'Seçili kurs'}" adlı kurs kalıcı olarak silinecektir. </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessingDelete}>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCourse} disabled={isProcessingDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"> {isProcessingDelete ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Siliniyor...</> : "Evet, Sil"} </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

      </section>
    </AlertDialog> // AlertDialog wrapper around the main section
  );
};

export default CoursesSection;