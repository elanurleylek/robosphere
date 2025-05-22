// src/pages/Register.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // AxiosError importunu kaldırın, sadece axios'u import edin
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AuthApiResponse {
  message?: string;
  // Backend'den dönebilecek diğer alanlar
}

// Axios benzeri bir hata nesnesinin beklenen yapısı için bir arayüz
// Bu, sunucudan bir yanıt içeren hatalar içindir.
interface AxiosErrorLike {
  message: string; // Tüm Error nesnelerinde bulunur
  response?: {     // Axios hatalarında sunucu yanıtı varsa bu özellik bulunur
    data?: AuthApiResponse | { message?: string }; // Hata yanıtının veri kısmı
    status?: number;
  };
  // Bazı Axios versiyonlarında/hatalarında bu özellik olabilir
  // isAxiosError?: boolean;
}

// Type Guard fonksiyonu: Bir hatanın Axios benzeri bir yapıya sahip olup olmadığını kontrol eder
function isAxiosErrorLike(error: unknown): error is AxiosErrorLike {
  if (error && typeof error === 'object' && 'message' in error) {
    // Temel olarak bir 'message' özelliği olan bir nesne olmalı
    // İsteğe bağlı olarak 'response' özelliğini de kontrol edebilirsiniz
    // if ('response' in error) { ... }
    return true;
  }
  return false;
}

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Hata", description: "Lütfen tüm alanları doldurun.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Hata", description: "Şifreler eşleşmiyor.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Hata", description: "Şifre en az 6 karakter olmalıdır.", variant: "destructive" });
      return;
    }

    const formData = {
      name,
      email,
      password,
      confirmPassword
    };

    setIsLoading(true);

    try {
      const response = await axios.post<AuthApiResponse>(
        'http://localhost:5000/api/auth/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      const data = response.data;

      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message || 'Kayıt sırasında bir sunucu hatası oluştu.');
      }

      toast({
        title: "Başarılı",
        description: data.message || "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...",
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) { // 'error' burada 'unknown' tipindedir
      console.error('Kayıt Hatası:', error);
      let errorMessage = "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.";

      if (isAxiosErrorLike(error)) {
        // Artık 'error' nesnesi 'AxiosErrorLike' tipinde kabul edilir
        // ve 'response' gibi özelliklerine güvenle erişilebilir (varsa).
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          // Eğer response.data.message yoksa, genel error.message kullanılır
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        // Axios olmayan veya 'response' özelliği olmayan genel Error nesneleri
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        // Hata sadece bir string ise
        errorMessage = error;
      }
      // Diğer durumlar için varsayılan errorMessage kalır

      toast({
        title: "Kayıt Başarısız",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      setIsLoading(false);
    }
  };

  // ... (JSX kodunuzun geri kalanı aynı)
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Kayıt Ol</CardTitle>
            <CardDescription className="text-center">Robotik Okulu ailesine katılın</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="Adınız Soyadınız" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="ornek@mail.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Zaten hesabınız var mı?{" "}
              <Link to="/login" className="text-primary hover:underline">Giriş Yapın</Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Register;