// src/components/sections/ProjectsSection.tsx
'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
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
import { Trash2, Edit, ArrowRight, Loader2 } from 'lucide-react';
import { projectApi, STATIC_FILES_DOMAIN } from '@/lib/api';
import { Project, DifficultyLevel, ProjectFormData, ProjectCreatePayload, ProjectUpdatePayload, ApiError } from '@/lib/types';
import { initialFormData } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';


const ProjectsSection: React.FC = () => {
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

  const fetchProjects = async () => {
    try { setLoading(true); setError(null); const data = await projectApi.getAll(); setProjects(Array.isArray(data) ? data : []); }
    catch (err: unknown) { const apiErr = err as ApiError; console.error("Projeleri çekerken HATA oluştu:", err); const errorMessage = apiErr.message || (err instanceof Error ? err.message : 'Projeler yüklenirken beklenmeyen bir hata oluştu.'); setError(errorMessage); setProjects([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormData({ title: project.title, description: project.description, difficulty: project.difficulty, technologies: project.technologies ? project.technologies.join(', ') : '', imageUrl: project.imageUrl || '', projectUrl: project.projectUrl || '', });
    setImageFile(null); setIsModalOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;

      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => { setFormData(prev => ({ ...prev, difficulty: value as DifficultyLevel })); };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { toast({ title: "Dosya Boyutu Büyük", description: "Resim dosyası 5MB'den büyük olamaz.", variant: "destructive" }); e.target.value = ''; setImageFile(null); if(editingProject && editingProject.imageUrl){ setFormData(prev => ({ ...prev, imageUrl: editingProject.imageUrl })); } else { setFormData(prev => ({ ...prev, imageUrl: '' })); } return; }
      if (!file.type.startsWith('image/')) { toast({ title: "Hatalı Dosya Türü", description: "Lütfen geçerli bir resim dosyası seçin.", variant: "destructive" }); e.target.value = ''; setImageFile(null); if(editingProject && editingProject.imageUrl){ setFormData(prev => ({ ...prev, imageUrl: editingProject.imageUrl })); } else { setFormData(prev => ({ ...prev, imageUrl: '' })); } return; }
      setImageFile(file); setFormData(prev => ({ ...prev, imageUrl: '' }));
    } else {
      setImageFile(null);
      if (editingProject) { setFormData(prev => ({ ...prev, imageUrl: editingProject.imageUrl || '' })); } else { setFormData(prev => ({ ...prev, imageUrl: '' })); }
    }
  };
  const handleRemoveImage = () => { setImageFile(null); setFormData(prev => ({ ...prev, imageUrl: '' })); if (editingProject) { toast({ title: "Resim Kaldırılacak", description: "Değişiklikleri kaydettiğinizde mevcut resim kaldırılacaktır." }); } else { toast({ title: "Resim Alanı Temizlendi" }); } };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.difficulty) { toast({ title: "Eksik Bilgi", description: "Lütfen zorunlu alanları doldurun.", variant: "destructive" }); return; }
    if (!userInfo?.token) { toast({ title: "Yetkilendirme Hatası", description: "Proje eklemek veya düzenlemek için giriş yapmalısınız.", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      let finalImageUrlForPayload: string | null | undefined = undefined;
      if (imageFile) {
        const uploadFormData = new FormData(); uploadFormData.append('image', imageFile); const headers: HeadersInit = {}; if (userInfo.token) { headers['Authorization'] = `Bearer ${userInfo.token}`; }
        const uploadResponse = await fetch(`${STATIC_FILES_DOMAIN}/api/upload`, { method: 'POST', body: uploadFormData, headers: headers });
        if (!uploadResponse.ok) { const errorData = await uploadResponse.json().catch(() => ({ message: `HTTP ${uploadResponse.status}` })); throw new Error(errorData.message || `Resim yüklenirken hata (Durum: ${uploadResponse.status})`); }
        const uploadData = await uploadResponse.json(); if (!uploadData.imageUrl) { throw new Error('Resim yüklendi ancak URL alınamadı.'); }
        finalImageUrlForPayload = uploadData.imageUrl;
      } else if (editingProject) { if (formData.imageUrl === '') { finalImageUrlForPayload = null; } else if (formData.imageUrl === editingProject.imageUrl) { finalImageUrlForPayload = undefined; } else { finalImageUrlForPayload = formData.imageUrl; }
      } else { finalImageUrlForPayload = formData.imageUrl || undefined; }

      const technologiesArray = formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
      const payloadBase = { title: formData.title.trim(), description: formData.description.trim(), difficulty: formData.difficulty, technologies: technologiesArray.length > 0 ? technologiesArray : undefined, projectUrl: formData.projectUrl?.trim() || undefined, imageUrl: finalImageUrlForPayload };

      if (editingProject) {
        if (!editingProject._id) { toast({ title: "Hata", description: "Düzenlenecek proje ID'si bulunamadı.", variant: "destructive" }); setSubmitting(false); return; }
        const result = await projectApi.update(editingProject._id, payloadBase as ProjectUpdatePayload); toast({ title: 'Proje Başarıyla Güncellendi!', description: `"${(result as Project).title || formData.title}" güncellendi.` });
      } else {
        const newProject = await projectApi.create(payloadBase as ProjectCreatePayload) as Project; toast({ title: 'Proje Başarıyla Eklendi!', description: `"${newProject.title}" sisteme kaydedildi.` });
      }
      setIsModalOpen(false); setEditingProject(null); setFormData(initialFormData); setImageFile(null); setDeletingProject(null); fetchProjects();
    } catch (err: unknown) {
      const actionType = editingProject ? 'güncellenirken' : 'eklenirken'; const apiErr = err as ApiError;
      const errorMessage = apiErr.message || (err instanceof Error ? err.message : `Proje ${actionType} bir hata oluştu.`);
      toast({ title: `Proje ${editingProject ? 'Güncelleme' : 'Ekleme'} Başarısız!`, description: errorMessage, variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const handleDeleteClick = (project: Project) => { setDeletingProject(project); };
  const handleConfirmDelete = async () => {
    if (!deletingProject?._id) return; if (!userInfo?.token) { toast({ title: "Yetkilendirme Hatası", description: "Proje silmek için giriş yapmalısınız.", variant: "destructive" }); setDeletingProject(null); return; }
    setSubmitting(true);
    try { await projectApi.delete(deletingProject._id); toast({ title: 'Proje Silindi', description: `"${deletingProject.title}" başarıyla silindi.` }); setDeletingProject(null); fetchProjects(); }
    catch (err: unknown) { const apiErr = err as ApiError; const errorMessage = apiErr.message || (err instanceof Error ? err.message : 'Proje silinirken bir hata oluştu.'); toast({ title: 'Silme Başarısız!', description: errorMessage, variant: 'destructive' }); setDeletingProject(null); }
    finally { setSubmitting(false); }
  };

  const displayedProjects = projects;

  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl || imageUrl === '') return '/default-project.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    return `${STATIC_FILES_DOMAIN}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section id="projects-section" className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Robotik Projelerimiz</h2>
            <p className="text-md text-gray-600 dark:text-gray-300 mt-2 mb-6">Öğrencilerimizin ve ekibimizin tamamladığı projelere göz atın.</p>
            {userInfo?.token && (
                // Dialog wrapper remains here
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
                {/* Dialog Trigger inside the Dialog */}
                <DialogTrigger asChild>
                    <Button variant="default" size="lg" onClick={() => { setEditingProject(null); setFormData(initialFormData); setImageFile(null); setIsModalOpen(true); }}>Yeni Proje Ekle</Button>
                </DialogTrigger>
                {/* Dialog Content inside the Dialog */}
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                    <DialogTitle>{editingProject ? 'Projeyi Düzenle' : 'Yeni Robotik Projesi Ekle'}</DialogTitle>
                    <DialogDescription>Projenizin detaylarını girin. Yıldızlı alanlar zorunludur.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="title" className="text-right col-span-1">Başlık <span className="text-red-500">*</span></Label> <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" required /> </div>
                    <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="description" className="text-right col-span-1">Açıklama <span className="text-red-500">*</span></Label> <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" required rows={4} /> </div>
                    <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="difficulty" className="text-right col-span-1">Zorluk <span className="text-red-500">*</span></Label> <Select name="difficulty" onValueChange={handleSelectChange} value={formData.difficulty || undefined} required> <SelectTrigger className="col-span-3" id="difficulty"><SelectValue placeholder="Seviye Seçin" /></SelectTrigger> <SelectContent> <SelectItem value="Kolay">Kolay</SelectItem> <SelectItem value="Orta">Orta</SelectItem> <SelectItem value="Zor">Zor</SelectItem> </SelectContent> </Select> </div>
                    <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="technologies" className="text-right col-span-1">Teknolojiler</Label> <Input id="technologies" name="technologies" value={formData.technologies} onChange={handleInputChange} className="col-span-3" placeholder="Virgülle ayırın (örn: Arduino, Python)" /> </div>
                    <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="imageFile" className="text-right col-span-1">Görsel Yükle</Label> <Input id="imageFile" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" /> </div>
                    {imageFile ? ( <div className="grid grid-cols-4 items-start gap-4"> <div className="col-start-2 col-span-3"> <img src={URL.createObjectURL(imageFile)} alt="Yeni Resim Önizleme" className="max-h-40 rounded-md border object-contain" /> <p className="text-xs text-muted-foreground mt-1">Yeni resim önizlemesi</p> </div> </div> ) : editingProject && formData.imageUrl ? ( <div className="grid grid-cols-4 items-start gap-4"> <div className="col-start-2 col-span-3 flex items-center gap-2"> <img src={getImageUrl(formData.imageUrl)} alt="Mevcut Resim" className="max-h-20 rounded-md border object-contain" onError={(e) => { console.warn("Resim yüklenemedi (Modal):", (e.target as HTMLImageElement).src, "-> Varsayılan resme geçiliyor."); (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = '/default-project.png'; (e.target as HTMLImageElement).classList.add('object-contain'); }} /> <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage} disabled={submitting}>Resmi Kaldır</Button> </div> </div> ) : null}
                    <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="imageUrl" className="text-right col-span-1">veya Görsel URL</Label> <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} className="col-span-3" placeholder="https://..." disabled={!!imageFile || (editingProject && formData.imageUrl !== '' && !imageFile)} /> </div>
                    <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="projectUrl" className="text-right col-span-1">Proje Linki</Label> <Input id="projectUrl" name="projectUrl" type="url" value={formData.projectUrl} onChange={handleInputChange} className="col-span-3" placeholder="https://github.com/..." /> </div>
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                           src={getImageUrl(project.imageUrl)}
                           alt={project.title}
                           className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                           onError={(e) => { console.warn("Resim yüklenemedi (Liste Görünümü):", (e.target as HTMLImageElement).src, "-> Varsayılan resme geçiliyor."); (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = '/default-project.png'; (e.target as HTMLImageElement).classList.add('object-contain'); }}
                          />
                      </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors line-clamp-2 h-[3rem]"><Link to={`/projects/${project._id}`}>{project.title}</Link></h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">{project.description}</p>
                      <div className="text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50 space-y-1">
                        {project.difficulty && <div>Zorluk: <span className="font-medium text-foreground/80">{project.difficulty}</span></div>}
                        {project.technologies && project.technologies.length > 0 && (
                          <div>Teknolojiler: <span className="font-medium text-foreground/80">{project.technologies.join(', ')}</span></div>
                        )}
                      </div>
                       {project.projectUrl && (
                          <Button variant="link" asChild className="mt-3 px-0 justify-start h-auto py-0 text-sm">
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
        {/* Dialog wrapper remains here */}
        <Dialog open={!!deletingProject} onOpenChange={(open) => { if (!open) setDeletingProject(null); }}>
           {/* Dialog Content inside the Dialog */}
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

    </section>
  );
};

export default ProjectsSection;