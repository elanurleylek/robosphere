
import React from 'react';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Users, BookOpen, Calendar, TrendingUp, 
  BarChart3, PieChart, Activity
} from 'lucide-react';

// Mock data for dashboard metrics
const metrics = [
  { title: 'Toplam Öğrenci', value: '538', icon: Users, change: '+12%', color: 'text-blue-500' },
  { title: 'Aktif Kurslar', value: '24', icon: BookOpen, change: '+3', color: 'text-green-500' },
  { title: 'Yaklaşan Etkinlikler', value: '8', icon: Calendar, change: '-1', color: 'text-amber-500' },
  { title: 'Aylık Gelir', value: '₺42,580', icon: TrendingUp, change: '+18%', color: 'text-violet-500' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gösterge Paneli</h1>
        <div className="text-sm text-muted-foreground">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-full bg-primary/10 ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-xs font-medium ${
                  metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Kurs Kayıtları</CardTitle>
            <CardDescription>Son 6 ay içindeki kurs kayıtları</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mb-2" />
              <p>Gerçek veri integrasyonu ile grafikler burada görünecek</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popüler Kurslar</CardTitle>
            <CardDescription>En çok kayıt yapılan kurslar</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center text-center text-muted-foreground">
              <PieChart className="h-12 w-12 mb-2" />
              <p>Gerçek veri integrasyonu ile pasta grafik burada görünecek</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Son Aktiviteler</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>Son 24 saat içindeki aktiviteler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Yeni öğrenci kaydı', 'Kurs güncellendi', 'Etkinlik eklendi', 'Öğrenci kaydı iptal edildi'].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="font-medium">{activity}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(Date.now() - index * 3600000).toLocaleTimeString('tr-TR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
