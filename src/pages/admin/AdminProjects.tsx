import React, { useState, useEffect } from 'react';
import { Project } from '../../lib/types';
import { projectApi } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');

  // Projeleri getir
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getAll();
        setProjects(data);
      } catch (error) {
        console.error('Projeleri çekerken hata:', error);
        setError('Projeler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Yeni proje ekle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProject = {
        title,
        description,
        difficulty,
        technologies: technologies.split(',').map(tech => tech.trim()),
        imageUrl,
        projectUrl
      };

      await projectApi.create(newProject);
      toast.success('Proje başarıyla eklendi!');
      
      // Formu temizle
      setTitle('');
      setDescription('');
      setDifficulty('');
      setTechnologies('');
      setImageUrl('');
      setProjectUrl('');

      // Projeleri yeniden yükle
      const updatedProjects = await projectApi.getAll();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Proje eklerken hata:', error);
      toast.error('Proje eklenirken bir hata oluştu');
    }
  };

  // Proje sil
  const handleDelete = async (id: string) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        await projectApi.delete(id);
        toast.success('Proje başarıyla silindi!');
        setProjects(projects.filter(project => project._id !== id));
      } catch (error) {
        console.error('Proje silinirken hata:', error);
        toast.error('Proje silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Projeleri Yönet</h1>

      {/* Proje Ekleme Formu */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Yeni Proje Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Başlık</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Zorluk Seviyesi</label>
            <Input
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2">Açıklama</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Teknolojiler (virgülle ayırın)</label>
            <Input
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div>
            <label className="block mb-2">Resim URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              type="url"
            />
          </div>
          <div>
            <label className="block mb-2">Proje URL</label>
            <Input
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              type="url"
            />
          </div>
        </div>
        <Button type="submit" className="mt-4">Proje Ekle</Button>
      </form>

      {/* Proje Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white rounded-lg shadow p-6">
            {project.imageUrl && (
              <img src={project.imageUrl} alt={project.title} className="w-full h-40 object-cover rounded-md mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500">
              <p>Zorluk: {project.difficulty}</p>
              {project.technologies && project.technologies.length > 0 && (
                <p>Teknolojiler: {project.technologies.join(', ')}</p>
              )}
            </div>
            <Button
              variant="destructive"
              onClick={() => handleDelete(project._id)}
              className="mt-4"
            >
              Sil
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects; 