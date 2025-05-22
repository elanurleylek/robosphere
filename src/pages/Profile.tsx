// src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'; // API istekleri için axios
import { useAuth } from '@/hooks/useAuth'; // AuthContext'ten kullanıcı ve token bilgisini alır
import Header from '@/components/Header'; // Başlık component'i
import Footer from '@/components/Footer'; // Altbilgi component'i
import { Loader2 } from 'lucide-react'; // Yükleme ikonu
// Proje ve Kurs tipleri
import { Course, Project, UserProfile as GlobalUserProfileType, ApiErrorResponseData } from '../lib/types'; // Merkezi tiplerden

// UserProfile arayüzü - Backend'den gelen profil yapısına uygun olmalı
// Bu arayüz, types.ts dosyasındaki AuthUser veya UserProfile arayüzü ile senkronize olmalıdır.
// Backend /api/users/:userId/profile endpoint'inden gelen veriye göre bu yapıyı tanımlarız.
// Backend'den name, email, avatar, bio, role ve populate edilmiş projects/courses geliyor varsayımıyla:
interface UserProfile {
  _id: string;
  name: string;  // Kullanıcı adı alanı (backend'den 'name' olarak geliyor)
  email: string;
  avatar?: string; // Avatar yolu veya URL'si
  bio?: string; // Biyografi
  joinDate?: Date | string; // Katılım tarihi (string veya Date olabilir)
  createdAt?: Date | string; // Oluşturulma tarihi (genellikle Mongoose timestamps'ten gelir)
  projects?: Project[]; // Kullanıcının projeleri (populate edildiyse)
  courses?: Course[]; // Kullanıcının katıldığı kurslar (populate edildiyse)
  role?: 'user' | 'admin'; // Kullanıcı rolü
}

// Axios hata yanıtı için data yapısı
interface AxiosErrorResponseData {
  message?: string;
  details?: unknown;
}

const Profile: React.FC = () => {
  // URL'den kullanıcı ID'sini alır (örn: /profile/123)
  const { userId } = useParams<{ userId: string }>();
  // AuthContext'ten giriş yapmış kullanıcı bilgisini, token'ı ve yükleme durumunu alır
  const { userInfo, token: authToken, loading: authLoading } = useAuth();
  // Profil verisi için state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // API yükleme durumu için state
  const [loading, setLoading] = useState(true);
  // Hata mesajı için state
  const [error, setError] = useState<string | null>(null);

  // Görüntülenen profilin, giriş yapmış kullanıcıya ait olup olmadığını kontrol eder
  const isOwnProfile = userInfo?._id === userId;

  // Profil verisini backend'den çeken fonksiyon
  useEffect(() => {
    const fetchProfile = async () => {
      // Eğer URL'de userId yoksa (pek olası değil ama kontrol iyi)
      if (!userId) {
        setError('Kullanıcı ID bulunamadı.');
        setLoading(false);
        return;
      }

      // EK KONTROL: userId'nin geçerli bir MongoDB ObjectId formatında olup olmadığını kontrol et
      // Bu, "/profile/edit" gibi geçerli olmayan userId değerleriyle API isteği yapılmasını engeller.
      // MongoDB ObjectId formatı 24 karakterli küçük/büyük harf veya rakam hex string'idir.
      const mongoObjectIdPattern = /^[0-9a-fA-F]{24}$/;
      if (!mongoObjectIdPattern.test(userId)) {
          console.warn(`Profile.tsx: Geçersiz userId formatı (${userId}). API isteği atlanıyor.`);
          // Geçersiz formatta ise API isteği yapma.
          // Bu durumda, "Profil bulunamadı" gibi bir durum gösterilebilir.
          setLoading(false); // Yüklemeyi bitir
          setProfile(null); // Profili null yaparak "Profil bulunamadı" durumunu tetikler
          // setError('Geçersiz kullanıcı ID formatı.'); // İsteğe bağlı olarak hata mesajı gösterilebilir
          return;
      }


      // Eğer token yoksa (ve sayfa korumalıysa) hata mesajını göster
      // Eğer backend /:userId/profile rotasını token olmadan da temel bilgileri gösterecek şekilde ayarladıysa bu kontrolü kaldırın
      if (!authToken) {
        setError('Profil bilgilerini görüntülemek için oturum açmanız gerekiyor.');
        setLoading(false);
        return;
      }

      // API isteği başlamadan önce yükleme durumunu ayarla
      setLoading(true);
      setError(null); // Önceki hataları temizle

      try {
        // Backend'deki /api/users/:userId/profile endpoint'ine istek yap
        // userId olarak URL'den gelen id'yi kullanıyoruz (kendi profilimiz veya başkası olabilir)
        const response = await axios.get<UserProfile>(
            `http://localhost:5000/api/users/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Token'ı Authorization header'ı ile gönder
            'Content-Type': 'application/json'
          },
        });

        // Başarılı yanıt geldiğinde
        console.log('API Profile Response Data:', response.data);
        setProfile(response.data); // Profil state'ini gelen veriyle güncelle
        // setError(null); // Hata zaten try bloğu başında temizlendi
      } catch (err) {
        // API isteği sırasında bir hata oluştuğunda
        console.error('Profil yüklenirken detaylı hata:', err);
        let errorMessage = 'Profil yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';

        // Hata objesinin axios hatası olup olmadığını kontrol et (manuel)
        if (err && typeof err === 'object' && (err as { response?: unknown }).response !== undefined && (err as { config?: unknown }).config !== undefined) {
           const axiosError = err as { response?: { data?: ApiErrorResponseData }, message?: string };
           if (axiosError.response?.data?.message) {
             // Backend'den gelen hata mesajı varsa onu kullan
             errorMessage = axiosError.response.data.message;
           } else if (axiosError.message) {
             // Backend'den spesifik mesaj gelmediyse axios'un kendi hata mesajını kullan
             errorMessage = axiosError.message;
           }
        } else if (err instanceof Error) { // Genel Error objesi mi?
           // Axios hatası değilse genel hata mesajını kullan
           errorMessage = err.message;
        }
        setError(errorMessage); // Hata state'ini ayarla
        setProfile(null); // Hata durumunda profili temizle
      } finally {
        // İstek tamamlandığında (başarılı veya hatalı) yükleme durumunu bitir
        setLoading(false);
      }
    };

    // useEffect'in çalışma koşulları:
    // 1. AuthContext yüklenmesi bittiğinde (!authLoading)
    // 2. Veya userId veya authToken değiştiğinde
    // Koşul bloğu: AuthContext yüklendiyse VE authToken varsa VE userId varsa
    if (!authLoading) {
        if (authToken && userId) {
            // EK KONTROL: userId'nin geçerli bir ObjectId formatında olup olmadığını tekrar kontrol et
            const mongoObjectIdPattern = /^[0-9a-fA-F]{24}$/;
            if (mongoObjectIdPattern.test(userId)) {
                fetchProfile(); // Geçerli ID formatında ise API isteğini yap
            } else {
                 // Eğer userId geçerli formatta değilse (örn: "edit"), API isteği yapma.
                 // Yüklemeyi bitir ve profili null yaparak "Profil bulunamadı" JSX'ini göster.
                 console.warn(`Profile.tsx: Geçersiz userId formatı (${userId}). API isteği atlanıyor.`);
                 setLoading(false);
                 setProfile(null);
            }
        } else if (!authToken) {
             // Eğer token yoksa ve authLoading bittiyse hata mesajını göster
            setError('Profil bilgilerini görüntülemek için oturum açmanız gerekiyor.');
            setLoading(false);
        }
        // Eğer userId yoksa (URL'de eksiklik), useEffect başındaki kontrol (if (!userId)) zaten hata verir.
    } else {
        // AuthContext yüklenirken "Yükleniyor..." göster
        setLoading(true);
    }
    // fetchProfile fonksiyonu useEffect dışında tanımlı, bu yüzden useCallback kullanmaya gerek yok
    // useEffect bağımlılık dizisindeki değişkenler değiştiğinde useEffect çalışır.
  }, [userId, authToken, authLoading]);


  // --- Render Edilecek JSX ---

  // Sayfa yükleniyor veya AuthContext yükleniyor ise Loader göster
  if (loading || authLoading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Profil yükleniyor...</p>
        </div>
        <Footer />
      </>
    );
  }

  // API'den hata geldiyse hata mesajını göster
  if (error) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4">
          <div className="bg-destructive/10 text-destructive p-6 rounded-lg text-center max-w-md">
             <h2 className="text-xl font-semibold mb-2">Bir Hata Oluştu</h2>
            <p>{error}</p>
            {/* Ana sayfaya dön linki */}
            <Link to="/" className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Profil datası null ise (hata olmadığında ama data gelmediğinde veya geçersiz ID durumunda)
  if (!profile) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          {/* Geçersiz ID veya profil bulunamadı mesajı */}
          <p className="text-xl text-muted-foreground">Profil bulunamadı veya yüklenemedi.</p>
        </div>
        <Footer />
      </>
    );
  }

  // Profil datası başarıyla yüklendiyse profil detaylarını göster
  const displayJoinDate = profile.createdAt || profile.joinDate; // createdAt'ı öncelikli kullan

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Profil Bilgileri Kartı */}
        <div className="bg-card text-card-foreground shadow-xl rounded-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-primary mb-4 sm:mb-0 flex-shrink-0">
              <img
                src={profile.avatar ? (profile.avatar.startsWith('http') ? profile.avatar : `http://localhost:5000${profile.avatar}`) : '/default-avatar.png'}
                alt={profile.name ? `${profile.name} avatarı` : 'Kullanıcı avatarı'}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = '/default-avatar.png')} // Resim yüklenemezse varsayılan göster
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground">{profile.name || 'Kullanıcı Adı Yok'}</h1>
              <p className="text-muted-foreground mt-1">{profile.email}</p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {profile.bio || 'Henüz biyografi eklenmemiş.'}
              </p>
              {displayJoinDate && (
                <p className="text-xs text-muted-foreground mt-3">
                  Katılım Tarihi: {new Date(displayJoinDate).toLocaleDateString('tr-TR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              )}
              {/* Kendi profili ise "Profili Düzenle" butonunu göster */}
              {isOwnProfile && (
                <div className="mt-4">
                  <Link
                    to={`/profile/edit`} // EditProfile sayfasına yönlendir
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Profili Düzenle
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projeler ve Katıldığı Kurslar Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Projeler Kartı */}
          <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Projeler</h2>
            {profile.projects && profile.projects.length > 0 ? (
              <ul className="space-y-3">
                {/* Proje listesi itemleri */}
                {profile.projects.map((project) => (
                  <li key={project._id} className="p-3 bg-background rounded-md shadow hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-lg text-primary">{project.title}</h3>
                    {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description.substring(0, 100)}{project.description.length > 100 && "..."}</p>}
                    {project.difficulty && <p className="text-xs text-muted-foreground mt-1">Zorluk: <span className="font-semibold">{project.difficulty}</span></p>}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Teknolojiler: </span>
                        {project.technologies.map(tech => (
                          <span key={tech} className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full mr-1 mb-1">{tech}</span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Henüz proje eklenmemiş.</p>
            )}
          </div>

          {/* Katıldığı Kurslar Kartı */}
          <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Katıldığı Kurslar</h2>
            {profile.courses && profile.courses.length > 0 ? (
              <ul className="space-y-3">
                {/* Kurs listesi itemleri */}
                {profile.courses.map((course) => (
                  <li key={course._id} className="p-3 bg-background rounded-md shadow hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-lg text-primary">{course.title}</h3>
                    {course.instructor && <p className="text-sm text-muted-foreground mt-1">Eğitmen: {course.instructor}</p>}
                    {course.category && <p className="text-xs text-muted-foreground mt-1">Kategori: <span className="font-semibold">{course.category}</span></p>}
                    {typeof course.price === 'number' && course.price > 0 && <p className="text-sm text-muted-foreground mt-1">Fiyat: <span className="font-semibold">{course.price} TL</span></p>}
                    {typeof course.price === 'number' && course.price === 0 && <p className="text-sm text-muted-foreground mt-1"><span className="font-semibold text-green-600">Ücretsiz</span></p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Henüz herhangi bir kursa katılım yok.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;