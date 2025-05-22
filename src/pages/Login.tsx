// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth'; // Düzeltilmiş import yolu
import { AuthUser } from '@/lib/types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Hata", description: "Lütfen tüm alanları doldurun.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: {
        token?: string;
        message?: string;
        _id?: string;
        name?: string;
        email?: string;
        role?: 'user' | 'admin';
        avatar?: string | null;
        enrolledCourseIds?: string[];
        bio?: string | null;
      } = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'E-posta veya şifre hatalı.');
      }

      if (!data._id || !data.name || !data.email) {
        console.error("Login response is missing required user fields (_id, name, email):", data);
        toast({ title: "Sunucu Hatası", description: "Kullanıcı bilgileri eksik alındı.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const loggedInUser: AuthUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role || 'user',
        avatar: data.avatar,
        enrolledCourseIds: data.enrolledCourseIds,
        bio: data.bio,
      };

      login(loggedInUser, data.token);

      toast({
        title: "Başarılı",
        description: "Giriş başarılı! Yönlendiriliyorsunuz...",
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Giriş Hatası:', error);
      const errorMessage = (error instanceof Error) ? error.message : "Giriş sırasında bir hata oluştu.";
      toast({
        title: "Giriş Başarısız",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // JSX aynı kalacak...
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
            <CardDescription className="text-center">Robotik Okulu'na hoş geldiniz</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="ornek@mail.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Şifre</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Şifremi Unuttum?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Giriş Yapılıyor...</> : "Giriş Yap"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center text-sm text-muted-foreground">
              Hesabınız yok mu?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">Hemen Kayıt Olun</Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;