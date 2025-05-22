// src/pages/ProjectsPage.tsx

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom'; // <<< Link import edildi
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, ArrowRight, Loader2 } from 'lucide-react'; // <<< ArrowRight import edildi (Loader2 zaten vardı)

// API ve Tipler
import { projectApi, STATIC_FILES_DOMAIN } from '../lib/api';
import { Project, DifficultyLevel, ProjectFormData, ProjectCreatePayload, ProjectUpdatePayload } from '../lib/types';
import { initialFormData } from '../lib/constants';
import { useAuth } from '@/hooks/useAuth';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { userInfo } = useAuth();

  // console.log(">>> ProjectsPage: Statik dosyalar için temel URL (STATIC_FILES_DOMAIN):", STATIC_FILES_DOMAIN);

  const fetchProjects = async () => {
    // console.log(">>> fetchProjects fonksiyonu çağrıldı.");
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getAll();
      // console.log(">>> projectApi.getAll() başarıyla tamamlandı, veri:", data);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      // console.error(">>> fetchProjects: Projeleri çekerken HATA oluştu:", err);
      const errorMessage = err instanceof Error ? err.message : 'Projeler yüklenirken beklenmeyen bir hata oluştu.';
      setError(errorMessage);
      setProjects([]);
    } finally {
      // console.log(">>> fetchProjects fonksiyonu bitti.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      difficulty: project.difficulty,
      technologies: project.technologies ? project.technologies.join(', ') : '',
      imageUrl: project.imageUrl || '',
      projectUrl: project.projectUrl || '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, difficulty: value as DifficultyLevel }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    } else {
      setImageFile(null);
      setFormData(prev => ({ ...prev, imageUrl: editingProject?.imageUrl || initialFormData.imageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setImageFile(null);
    if (editingProject) {
        toast({ title: "Resim Kaldırıldı", description: "Değişiklikleri kaydettiğinizde resim projeden kaldırılacaktır." });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.difficulty) {
      toast({ title: "Eksik Bilgi", description: "Lütfen zorunlu alanları doldurun.", variant: "destructive" });
      return;
    }
    if (!userInfo?.token) {
        toast({ title: "Yetkilendirme Hatası", description: "Proje eklemek veya düzenlemek için giriş yapmalısınız.", variant: "destructive" });
        return;
    }

    setSubmitting(true);

    try {
      let finalImageUrlForPayload: string | null | undefined = undefined;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const apiUploadUrl = `http://localhost:5000/api/upload`; // Backend upload URL

        const token = localStorage.getItem('userToken');
        const headers: HeadersInit = {};
        if (token) { headers['Authorization'] = `Bearer ${token}`; }

        const uploadResponse = await fetch(apiUploadUrl, { method: 'POST', body: uploadFormData, headers: headers });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({ message: 'Resim yükleme yanıtı okunamadı.' }));
          throw new Error(errorData.message || `Resim yüklenirken hata (Durum: ${uploadResponse.status})`);
        }
        const uploadData = await uploadResponse.json();
        if (!uploadData.imageUrl) {
          throw new Error('Resim yüklendi ancak URL alınamadı. Backend yanıtını kontrol edin.');
        }
        finalImageUrlForPayload = uploadData.imageUrl;
      } else if (formData.imageUrl) {
        finalImageUrlForPayload = formData.imageUrl;
      } else if (editingProject && editingProject.imageUrl && formData.imageUrl === '') {
        finalImageUrlForPayload = null;
      }


      const technologiesArray = formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '');

      if (editingProject) {
        if (!editingProject._id) {
          toast({ title: "Hata", description: "Düzenlenecek proje ID'si bulunamadı.", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const projectDataToUpdate: ProjectUpdatePayload = {
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          technologies: technologiesArray,
          projectUrl: formData.projectUrl || undefined,
          // imageUrl'i sadece tanımlıysa (undefined değilse) veya null ise gönder
          ...(finalImageUrlForPayload !== undefined && { imageUrl: finalImageUrlForPayload }),
        };

        const result = await projectApi.update(editingProject._id, projectDataToUpdate);
        toast({ title: 'Proje Başarıyla Güncellendi!', description: `"${(result as Project).title || formData.title}" güncellendi.` });

      } else {
        const projectDataToSend: ProjectCreatePayload = {
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          technologies: technologiesArray,
          imageUrl: finalImageUrlForPayload || undefined,
          projectUrl: formData.projectUrl || undefined,
        };
        const newProject = await projectApi.create(projectDataToSend) as Project;
        toast({ title: 'Proje Başarıyla Eklendi!', description: `"${newProject.title}" sisteme kaydedildi.` });
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setFormData(initialFormData);
      setImageFile(null);
      fetchProjects();

    } catch (err: unknown) {
      const actionType = editingProject ? 'güncellenirken' : 'eklenirken';
      // console.error(`>>> handleSubmit: Proje ${actionType} HATA:`, err);
      const errorMessage = err instanceof Error ? err.message : `Proje ${actionType} bir hata oluştu.`;
      toast({ title: `Proje ${editingProject ? 'Güncelleme' : 'Ekleme'} Başarısız!`, description: errorMessage, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setDeletingProject(project);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject?._id) return;
    if (!userInfo?.token) {
        toast({ title: "Yetkilendirme Hatası", description: "Proje silmek için giriş yapmalısınız.", variant: "destructive" });
        setDeletingProject(null);
        return;
    }

    setSubmitting(true);
    try {
      await projectApi.delete(deletingProject._id);
      toast({ title: 'Proje Silindi', description: `"${deletingProject.title}" başarıyla silindi.` });
      setDeletingProject(null);
      fetchProjects();
    } catch (err: unknown) {
      // console.error(">>> handleConfirmDelete: Proje silinirken HATA:", err);
      const errorMessage = err instanceof Error ? err.message : 'Proje silinirken bir hata oluştu.';
      toast({ title: 'Silme Başarısız!', description: errorMessage, variant: 'destructive' });
      setDeletingProject(null);
    } finally {
      setSubmitting(false);
    }
  };

  const displayedProjects = projects;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 text-center bg-gray-100 dark:bg-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Robotik Projelerimiz</h1>
          <p className="text-md text-gray-600 dark:text-gray-300 mt-2">Öğrencilerimizin ve ekibimizin tamamladığı projelere göz atın.</p>
          <div className="mt-6">
            {userInfo?.token && (
                <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) {
                    setEditingProject(null);
                    setFormData(initialFormData);
                    setImageFile(null);
                    }
                }}>
                <DialogTrigger asChild>
                    <Button variant="default" size="lg" onClick={() => { setEditingProject(null); setFormData(initialFormData); setImageFile(null); setIsModalOpen(true); }}>Yeni Proje Ekle</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                    <DialogTitle>{editingProject ? 'Projeyi Düzenle' : 'Yeni Robotik Projesi Ekle'}</DialogTitle>
                    <DialogDescription>Projenizin detaylarını girin. Yıldızlı alanlar zorunludur.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right col-span-1">Başlık <span className="text-red-500">*</span></Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right col-span-1">Açıklama <span className="text-red-500">*</span></Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" required rows={4} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="difficulty" className="text-right col-span-1">Zorluk <span className="text-red-500">*</span></Label>
                        <Select name="difficulty" onValueChange={handleSelectChange} value={formData.difficulty || undefined} required>
                        <SelectTrigger className="col-span-3" id="difficulty"><SelectValue placeholder="Seviye Seçin" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Kolay">Kolay</SelectItem>
                            <SelectItem value="Orta">Orta</SelectItem>
                            <SelectItem value="Zor">Zor</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="technologies" className="text-right col-span-1">Teknolojiler</Label>
                        <Input id="technologies" name="technologies" value={formData.technologies} onChange={handleInputChange} className="col-span-3" placeholder="Virgülle ayırın (örn: Arduino, Python)" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageFile" className="text-right col-span-1">Görsel Yükle</Label>
                        <Input id="imageFile" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
                    </div>
                    {imageFile ? (
                        <div className="grid grid-cols-4 items-start gap-4">
                            <div className="col-start-2 col-span-3">
                                <img src={URL.createObjectURL(imageFile)} alt="Yeni Resim Önizleme" className="max-h-40 rounded-md border object-contain" />
                                <p className="text-xs text-muted-foreground mt-1">Yeni resim önizlemesi</p>
                            </div>
                        </div>
                    ) : editingProject && formData.imageUrl ? (
                        <div className="grid grid-cols-4 items-start gap-4">
                            <div className="col-start-2 col-span-3 flex items-center gap-2">
                                <img
                                    src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `${STATIC_FILES_DOMAIN}${formData.imageUrl}`}
                                    alt="Mevcut Resim"
                                    className="max-h-20 rounded-md border object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/80x80?text=URL+Hatalı`; (e.target as HTMLImageElement).classList.add('object-contain');}}
                                />
                                <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage} disabled={submitting}>Resmi Değiştir/Kaldır</Button>
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageUrl" className="text-right col-span-1">veya Görsel URL</Label>
                        <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} className="col-span-3" placeholder="https://..." disabled={!!imageFile} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="projectUrl" className="text-right col-span-1">Proje Linki</Label>
                        <Input id="projectUrl" name="projectUrl" type="url" value={formData.projectUrl} onChange={handleInputChange} className="col-span-3" placeholder="https://github.com/..." />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingProject(null); setFormData(initialFormData); setImageFile(null); }}>İptal</Button></DialogClose>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</> : (editingProject ? 'Değişiklikleri Kaydet' : 'Projeyi Kaydet')}
                        </Button>
                    </DialogFooter>
                    </form>
                </DialogContent>
                </Dialog>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading && <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> <p className="mt-2 text-muted-foreground">Projeler yükleniyor...</p></div>}
            {error && <div className="text-center py-10 text-red-600 dark:text-red-400"><p className="font-semibold">Hata Oluştu!</p><p>{error}</p></div>}
            {!loading && !error && (
              displayedProjects.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-10">
                    Henüz hiç proje eklenmemiş.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedProjects.map(project => (
                    <div key={project._id} className="bg-card text-card-foreground rounded-xl shadow-lg border border-border overflow-hidden flex flex-col transition-all hover:shadow-xl">
                      <div className="aspect-[16/9] bg-muted overflow-hidden">
                        <img
                             src={project.imageUrl ? (project.imageUrl.startsWith('http') ? project.imageUrl : `${STATIC_FILES_DOMAIN}${project.imageUrl}`) : `https://via.placeholder.com/400x225?text=${encodeURIComponent(project.title)}`}
                             alt={project.title}
                             className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                             onError={(e) => {
                                // console.warn("Resim yüklenemedi (Liste):", (e.target as HTMLImageElement).src);
                                (e.target as HTMLImageElement).onerror = null;
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x225?text=Gorsel+Yok`;
                              }}
                            />
                        </div>
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Link component'i doğru şekilde kullanılıyor */}
                        <h3 className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors"><Link to={`/projects/${project._id}`}>{project.title}</Link></h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">{project.description}</p>
                        <div className="text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50 space-y-1">
                          {project.difficulty && <div>Zorluk: <span className="font-medium text-foreground/80">{project.difficulty}</span></div>}
                          {project.technologies && project.technologies.length > 0 && (
                            <div>Teknolojiler: <span className="font-medium text-foreground/80">{project.technologies.join(', ')}</span></div>
                          )}
                        </div>
                         {project.projectUrl && (
                            <Button variant="link" asChild className="mt-3 px-0 justify-start h-auto py-0 text-sm">
                                {/* ArrowRight ikonu doğru şekilde kullanılıyor */}
                                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">Projeyi Gör <ArrowRight className="ml-1 h-4 w-4" /></a>
                            </Button>
                         )}
                      </div>
                      {userInfo?.token && (
                          <div className="flex justify-end gap-2 p-3 border-t border-border/50 bg-muted/30">
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(project)} className="text-muted-foreground hover:text-primary">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(project)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <Dialog open={!!deletingProject} onOpenChange={(open) => { if (!open) setDeletingProject(null); }}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Projeyi Silmek İstediğinize Emin Misiniz?</DialogTitle>
               <DialogDescription>
                  Bu işlem geri alınamaz. "{deletingProject?.title}" projesi kalıcı olarak silinecektir.
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button variant="outline" onClick={() => setDeletingProject(null)} disabled={submitting}>İptal</Button>
               <Button variant="destructive" onClick={handleConfirmDelete} disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Siliniyor...</> : 'Evet, Sil'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ProjectsPage;