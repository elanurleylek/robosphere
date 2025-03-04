
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Plus, Edit, Trash2, MoreHorizontal, Filter,
  Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

// Mock course data
const mockCourses = [
  { id: 1, title: 'Robotik Başlangıç', category: 'Robotik Temel', students: 52, price: '₺499', status: 'Aktif' },
  { id: 2, title: 'Arduino ile Projeler', category: 'Arduino', students: 48, price: '₺699', status: 'Aktif' },
  { id: 3, title: 'Raspberry Pi İleri Seviye', category: 'Raspberry Pi', students: 24, price: '₺899', status: 'Aktif' },
  { id: 4, title: 'Sensör Teknolojileri', category: 'Sensörler', students: 36, price: '₺599', status: 'Taslak' },
  { id: 5, title: 'Robot Yarışmasına Hazırlık', category: 'Robotik Temel', students: 18, price: '₺799', status: 'Aktif' },
];

const AdminCourses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddCourse = () => {
    toast.info('Yeni kurs ekleme özelliği gelecek!');
  };
  
  const handleEditCourse = (id: number) => {
    toast.info(`Kurs düzenleme (ID: ${id}) özelliği gelecek!`);
  };
  
  const handleDeleteCourse = (id: number) => {
    toast.success(`Kurs silindi (ID: ${id})`);
  };
  
  const handleViewCourse = (id: number) => {
    toast.info(`Kurs detayları (ID: ${id}) özelliği gelecek!`);
  };
  
  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kurslar</h1>
        <Button onClick={handleAddCourse}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Kurs
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Kurs Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Kurs ara..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" /> Filtrele
            </Button>
          </div>
          
          {/* Courses table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Kurs Adı</th>
                  <th className="text-left py-3 px-4 font-medium">Kategori</th>
                  <th className="text-left py-3 px-4 font-medium">Öğrenci</th>
                  <th className="text-left py-3 px-4 font-medium">Fiyat</th>
                  <th className="text-left py-3 px-4 font-medium">Durum</th>
                  <th className="text-right py-3 px-4 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{course.title}</td>
                    <td className="py-3 px-4">{course.category}</td>
                    <td className="py-3 px-4">{course.students}</td>
                    <td className="py-3 px-4">{course.price}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'Aktif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewCourse(course.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Toplam {mockCourses.length} kurs
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 min-w-8">1</Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourses;
