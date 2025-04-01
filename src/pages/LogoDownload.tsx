
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LogoDownload: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Logolarımız</h1>
          
          <div className="max-w-3xl mx-auto grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Standart Logo</CardTitle>
                <CardDescription>
                  Robotik Okulu'nun standart logosu. İndirmek için butona tıklayın.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Logo size="lg" />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Küçük Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Logo size="sm" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Orta Boy Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Logo size="md" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Büyük Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Logo size="xl" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogoDownload;
