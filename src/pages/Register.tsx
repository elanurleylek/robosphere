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

// Ortam değişkenini alırken TypeScript hatasını önlemek için
// Vite için: import.meta.env üzerinde VITE_API_URL tanımını genişletin
// CRA için: process.env üzerinde REACT_APP_API_URL tanımını genişletin
// Tip tanımları (typings) dosyanızda (örneğin src/vite-env.d.ts veya src/react-app-env.d.ts)
// bu değişkeni tanımlamanız gerekebilir:
// declare interface ImportMetaEnv {
//   readonly VITE_API_URL: string;
// }
// declare interface ProcessEnv {
//   readonly REACT_APP_API_URL: string;
// }
// Bu örnekte doğrudan kullanacağız, ancak TypeScript projesinde tip güvenliği için tanımlamak iyidir.

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
      // API Base URL'sini ortam değişkeninden al
      // Projenizin kurulumuna göre doğru değişkeni kullanın:
      // Vite projeleri için: import.meta.env.VITE_API_URL
      // Create React App (CRA) projeleri için: process.env.REACT_APP_API_URL
      const API_BASE_URL = import.meta.env.VITE_API_URL; // Veya process.env.REACT_APP_API_URL

      if (!API_BASE_URL) {
         // Eğer ortam değişkeni tanımlanmamışsa hata ver
         console.error("API URL environment variable is not defined!");
         toast({ title: "Yapılandırma Hatası", description: "API URL'si tanımlanmamış. Lütfen .env dosyanızı kontrol edin.", variant: "destructive" });
         setIsLoading(false);
         return;
      }

      const response = await axios.post<AuthApiResponse>(
        `${API_BASE_URL}/api/auth/register`, // Ortam değişkeni + endpoint
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Cookie veya session bilgileri için
        }
      );

      const data = response.data;

      // 200-299 aralığında olmayan durum kodları hata olarak kabul edilir.
      // Axios normalde 4xx/5xx durum kodlarını catch bloğuna düşürür,
      // ancak yine de bu kontrolü yapmak güvenli olabilir,
      // özellikle bazı özel durumlar için veya Axios'un eski versiyonlarında.
      // Modern Axios versiyonlarında bu kontrol genellikle gerekli değildir
      // çünkü 4xx/5xx kodları otomatik olarak hataya dönüşür.
      // if (response.status < 200 || response.status >= 300) {
      //   // Bu kısım modern Axios ile genellikle unreachable
      //   throw new Error(data.message || `Sunucu beklenmeyen durum kodu döndürdü: ${response.status}`);
      // }


      toast({
        title: "Başarılı",
        description: data.message || "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...",
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) { // 'error' artık AxiosError veya genel Error olabilir
      console.error('Kayıt Hatası:', error);
      let errorMessage = "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.";

      // CORS hatası genellikle burada yakalanır, response nesnesi olmayabilir.
      // isAxiosErrorLike kontrolü burada işe yarar.
      if (isAxiosErrorLike(error)) {
        // Sunucudan dönen bir yanıt varsa ve içinde mesaj varsa onu kullan
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.message.includes("Network Error")) {
          // Ağ hatası (sunucuya ulaşılamıyor olabilir veya CORS engelledi)
           errorMessage = "Sunucuya ulaşılamıyor veya ağ hatası oluştu. CORS yapılandırmasını kontrol edin.";
        }
        else {
          // Axios hatası ama response.data.message yoksa genel error.message kullanılır
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

  // ... (JSX kodunuz aynı kalıyor)
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