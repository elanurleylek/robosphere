import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { AuthUser, ApiErrorResponseData } from '@/lib/types'; // AuthUser'ı import ettiğinizden emin olun
import { STATIC_FILES_DOMAIN } from '@/lib/api';

interface EditProfileFormData {
  name: string;
  bio: string;
}

interface BasicAxiosErrorShape {
    response?: {
        data?: ApiErrorResponseData;
        status?: number;
    };
    config?: object;
    message?: string;
}

function isBasicAxiosErrorShape(err: unknown): err is BasicAxiosErrorShape {
    if (typeof err !== 'object' || err === null) {
        return false;
    }
     return 'response' in err && typeof (err as { response: unknown }).response === 'object' &&
           'config' in err;
}


const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, token, updateUserInfo, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<EditProfileFormData>({ name: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentAvatarPath, setCurrentAvatarPath] = useState<string | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setPageLoading(true);
      return;
    }
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        bio: userInfo.bio || '',
      });

      const avatarUrl = userInfo.avatar
        ? (userInfo.avatar.startsWith('http')
          ? userInfo.avatar
          : `${STATIC_FILES_DOMAIN}${userInfo.avatar.startsWith('/') ? userInfo.avatar : '/' + userInfo.avatar}`)
        : '/default-avatar.png';

      setAvatarPreview(avatarUrl);
      setCurrentAvatarPath(userInfo.avatar === null ? undefined : userInfo.avatar);
      setPageLoading(false);
    } else if (!userInfo && !authLoading) {
      toast({ title: "Hata", description: "Profili düzenlemek için giriş yapmalısınız.", variant: "destructive" });
      navigate('/login');
    }
    // ESLint uyarısı kaldırıldı, çünkü bağımlılıklar zaten doğruydu.
  }, [userInfo, authLoading, navigate, toast]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ title: "Hatalı Dosya Türü", description: "Lütfen bir resim dosyası seçin.", variant: "destructive"});
        e.target.value = '';
        setAvatarFile(null);
        const fallbackUrl = currentAvatarPath
             ? (currentAvatarPath.startsWith('http')
               ? currentAvatarPath
               : `${STATIC_FILES_DOMAIN}${currentAvatarPath.startsWith('/') ? currentAvatarPath : '/' + currentAvatarPath}`)
             : '/default-avatar.png';
        setAvatarPreview(fallbackUrl);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Dosya Boyutu Büyük", description: "Avatar dosya boyutu 5MB'den büyük olamaz.", variant: "destructive"});
        e.target.value = '';
        setAvatarFile(null);
         const fallbackUrl = currentAvatarPath
             ? (currentAvatarPath.startsWith('http')
               ? currentAvatarPath
               : `${STATIC_FILES_DOMAIN}${currentAvatarPath.startsWith('/') ? currentAvatarPath : '/' + currentAvatarPath}`)
             : '/default-avatar.png';
        setAvatarPreview(fallbackUrl);
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
       const fallbackUrl = currentAvatarPath
             ? (currentAvatarPath.startsWith('http')
               ? currentAvatarPath
               : `${STATIC_FILES_DOMAIN}${currentAvatarPath.startsWith('/') ? currentAvatarPath : '/' + currentAvatarPath}`)
             : '/default-avatar.png';
      setAvatarPreview(fallbackUrl);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarFile(null);
    setAvatarPreview('/default-avatar.png');
    setCurrentAvatarPath(undefined);
    toast({ title: "Bilgi", description: "Avatar kaldırılmak üzere işaretlendi. Kaydettiğinizde uygulanacaktır." });
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !userInfo) {
      toast({ title: "Hata", description: "Yetkilendirme başarısız.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('bio', formData.bio);

    if (avatarFile) {
      submissionData.append('avatarImage', avatarFile);
    }
     else if (currentAvatarPath === undefined && userInfo.avatar && userInfo.avatar !== '' && !userInfo.avatar.includes('default-avatar.png')) {
        submissionData.append('removeAvatar', 'true');
     }


    try {
      const response = await axios.put<AuthUser>( // AuthUser tipi burada da kullanıldı
        `http://localhost:5000/api/users/profile`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      toast({ title: "Başarılı", description: "Profiliniz başarıyla güncellendi." });

      if (updateUserInfo && response.data) {
        console.log("Backend Update Response Data:", response.data); // <-- Debug log
        console.log("Backend Update Response Avatar Path:", response.data.avatar); // <-- Backend'den dönen yeni avatar yolunu logla

        updateUserInfo(response.data);
      }

      if (userInfo?._id) {
         navigate(`/profile/${userInfo._id}`);
      } else {
         navigate('/dashboard');
      }

    } catch (err: unknown) {
      console.error('Profil güncelleme hatası:', err);
      let errorMessage = "Profil güncelleme sırasında bir hata oluştu.";

      if (isBasicAxiosErrorShape(err)) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             const axiosErr = err as any;
             errorMessage = (axiosErr.response?.data as ApiErrorResponseData)?.message || axiosErr.message || errorMessage;
        } else if (err instanceof Error) {
           errorMessage = err.message;
        }

      toast({
        title: "Güncelleme Başarısız",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // JSX kısmı
  if (pageLoading || authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-lg text-muted-foreground">Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.</p>
            <Button onClick={() => navigate('/login')} className="mt-4">Giriş Yap</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Profili Düzenle</CardTitle>
              <CardDescription>Profil bilgilerinizi ve avatarınızı buradan güncelleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Form Alanı */}
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex items-center space-x-4">
                    {/* Avatar önizlemesi */}
                    <img
                       src={avatarPreview || '/default-avatar.png'}
                       alt="Avatar Önizleme"
                       className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border bg-muted flex-shrink-0"
                       onError={(e) => { e.currentTarget.src = '/default-avatar.png'; e.currentTarget.classList.add('object-contain'); }}
                    />
                    <div className="flex flex-col space-y-2 flex-grow">
                      <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                       {/* Sadece mevcut bir avatar varsa ve bu varsayılan değilse "Avatarı Kaldır" butonunu göster */}
                       {/* currentAvatarPath undefined OLMADIĞINI ve default olmadığını kontrol et */}
                       {currentAvatarPath && currentAvatarPath !== '' && !currentAvatarPath.includes('default-avatar.png') && (
                         <Button type="button" variant="outline" size="sm" onClick={handleRemoveAvatar} disabled={isSubmitting} className="flex items-center w-max">
                           <Trash2 className="mr-2 h-4 w-4" /> Avatarı Kaldır
                         </Button>
                       )}
                    </div>
                  </div>
                </div>
                {/* İsim Form Alanı */}
                <div className="space-y-2">
                  <Label htmlFor="name">İsim</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Adınız ve soyadınız" className="mt-1" />
                </div>
                {/* Biyografi Form Alanı */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Kendinizden bahsedin..." rows={5} className="mt-1 resize-y" />
                </div>
                {/* Butonlar */}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                        İptal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor...</> : "Değişiklikleri Kaydet"}
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;