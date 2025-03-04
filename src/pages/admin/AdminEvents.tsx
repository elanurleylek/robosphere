
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Plus, Edit, Trash2, Filter,
  Calendar, MapPin, Users, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

// Import event data from the data file
import { eventsList } from '@/data/events';

// Convert to admin format
const mockEvents = eventsList.map((event, index) => ({
  id: index + 1,
  title: event.title,
  date: event.date,
  location: event.location || 'Belirtilmemiş',
  type: event.type || 'Etkinlik',
  attendees: event.attendees || 0,
  status: Math.random() > 0.7 ? 'Taslak' : 'Yayında'
}));

const AdminEvents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddEvent = () => {
    toast.info('Yeni etkinlik ekleme özelliği gelecek!');
  };
  
  const handleEditEvent = (id: number) => {
    toast.info(`Etkinlik düzenleme (ID: ${id}) özelliği gelecek!`);
  };
  
  const handleDeleteEvent = (id: number) => {
    toast.success(`Etkinlik silindi (ID: ${id})`);
  };
  
  const filteredEvents = mockEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Etkinlikler</h1>
        <Button onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Etkinlik
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Etkinlik Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Etkinlik ara..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" /> Filtrele
            </Button>
          </div>
          
          {/* Events table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Etkinlik Adı</th>
                  <th className="text-left py-3 px-4 font-medium">Tarih</th>
                  <th className="text-left py-3 px-4 font-medium">Konum</th>
                  <th className="text-left py-3 px-4 font-medium">Tür</th>
                  <th className="text-left py-3 px-4 font-medium">Katılımcı</th>
                  <th className="text-left py-3 px-4 font-medium">Durum</th>
                  <th className="text-right py-3 px-4 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{event.title}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> 
                        {event.date}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> 
                        {event.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">{event.type}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" /> 
                        {event.attendees}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'Yayında' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)}>
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
              Toplam {mockEvents.length} etkinlik
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

export default AdminEvents;
