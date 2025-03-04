
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Plus, Edit, Trash2, MoreHorizontal, Filter,
  Mail, Phone, ChevronLeft, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Mock user data
const mockUsers = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '555-123-4567', role: 'Öğrenci', status: 'Aktif', registered: '10.02.2023' },
  { id: 2, name: 'Ayşe Kaya', email: 'ayse@example.com', phone: '555-234-5678', role: 'Öğrenci', status: 'Aktif', registered: '15.01.2023' },
  { id: 3, name: 'Mehmet Demir', email: 'mehmet@example.com', phone: '555-345-6789', role: 'Eğitmen', status: 'Aktif', registered: '05.12.2022' },
  { id: 4, name: 'Fatma Şahin', email: 'fatma@example.com', phone: '555-456-7890', role: 'Öğrenci', status: 'Pasif', registered: '20.03.2023' },
  { id: 5, name: 'Ali Öztürk', email: 'ali@example.com', phone: '555-567-8901', role: 'Eğitmen', status: 'Aktif', registered: '18.11.2022' },
];

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddUser = () => {
    toast.info('Yeni kullanıcı ekleme özelliği gelecek!');
  };
  
  const handleEditUser = (id: number) => {
    toast.info(`Kullanıcı düzenleme (ID: ${id}) özelliği gelecek!`);
  };
  
  const handleDeleteUser = (id: number) => {
    toast.success(`Kullanıcı silindi (ID: ${id})`);
  };
  
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Aktif' ? 'Pasif' : 'Aktif';
    toast.success(`Kullanıcı durumu değiştirildi: ${newStatus}`);
  };
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kullanıcılar</h1>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Kullanıcı
        </Button>
      </div>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{mockUsers.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Toplam Kullanıcı</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{mockUsers.filter(u => u.role === 'Öğrenci').length}</div>
              <div className="text-sm text-muted-foreground mt-1">Öğrenci</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{mockUsers.filter(u => u.role === 'Eğitmen').length}</div>
              <div className="text-sm text-muted-foreground mt-1">Eğitmen</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Kullanıcı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Kullanıcı ara..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" /> Filtrele
            </Button>
          </div>
          
          {/* Users table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Kullanıcı</th>
                  <th className="text-left py-3 px-4 font-medium">İletişim</th>
                  <th className="text-left py-3 px-4 font-medium">Rol</th>
                  <th className="text-left py-3 px-4 font-medium">Kayıt Tarihi</th>
                  <th className="text-left py-3 px-4 font-medium">Durum</th>
                  <th className="text-right py-3 px-4 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Eğitmen' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.registered}</td>
                    <td className="py-3 px-4">
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-normal"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                      >
                        {user.status === 'Aktif' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Aktif
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="mr-1 h-4 w-4" />
                            Pasif
                          </div>
                        )}
                      </Button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
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
              Toplam {filteredUsers.length} kullanıcı
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

export default AdminUsers;
