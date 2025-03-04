
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basit validasyon
    if (!email || !password) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Bu kısım gerçek bir backend olmadan sadece demo amaçlıdır
    try {
      // Simüle edilmiş giriş
      setTimeout(() => {
        toast({
          title: "Başarılı",
          description: "Giriş başarılı! Yönlendiriliyorsunuz...",
        });
        
        // Başarılı giriş sonrası ana sayfaya yönlendirme
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }, 1500);
    } catch (error) {
      toast({
        title: "Giriş Başarısız",
        description: "E-posta veya şifre hatalı.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
            <CardDescription className="text-center">
              Robotik Okulu'na hoş geldiniz
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@mail.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Hesabınız yok mu?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Hemen Kayıt Olun
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
