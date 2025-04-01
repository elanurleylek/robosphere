
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const LogoDownload: React.FC = () => {
  const [logoFormat, setLogoFormat] = useState<'svg' | 'jpeg'>('svg');
  
  // Robot görseli indirme fonksiyonu
  const downloadRobotImage = () => {
    const robotImage = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e';
    
    fetch(robotImage)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'robotik-okulu-robot.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Robot görseli JPEG olarak indirildi!');
      })
      .catch(error => {
        console.error('Görsel indirme hatası:', error);
        toast.error('Görsel indirilirken bir hata oluştu.');
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Logolarımız</h1>
          
          <div className="max-w-3xl mx-auto grid gap-8">
            <Tabs defaultValue="logolar">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="logolar">Logolar</TabsTrigger>
                <TabsTrigger value="robot">Robot Görseli</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logolar">
                <Card>
                  <CardHeader>
                    <CardTitle>Standart Logo</CardTitle>
                    <CardDescription>
                      Robotik Okulu'nun standart logosu. İndirmek için format seçin ve butona tıklayın.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <RadioGroup 
                        defaultValue="svg" 
                        className="flex gap-4"
                        onValueChange={(value) => setLogoFormat(value as 'svg' | 'jpeg')}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="svg" id="svg" />
                          <Label htmlFor="svg">SVG Format</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jpeg" id="jpeg" />
                          <Label htmlFor="jpeg">JPEG Format</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex justify-center">
                      <Logo size="lg" downloadFormat={logoFormat} />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Küçük Logo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Logo size="sm" downloadFormat={logoFormat} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Orta Boy Logo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Logo size="md" downloadFormat={logoFormat} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Büyük Logo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Logo size="xl" downloadFormat={logoFormat} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="robot">
                <Card>
                  <CardHeader>
                    <CardTitle>Robot Görseli</CardTitle>
                    <CardDescription>
                      Ana sayfada kullanılan robot görselini JPEG formatında indirebilirsiniz.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative w-full max-w-lg mb-6">
                      <img 
                        src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" 
                        alt="Robot" 
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                    
                    <Button 
                      onClick={downloadRobotImage}
                      variant="default" 
                      className="mt-4 flex items-center gap-2"
                    >
                      <Download size={16} />
                      JPEG Olarak İndir
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogoDownload;
