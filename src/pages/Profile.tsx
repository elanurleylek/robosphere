// src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'; // Ana profil fetch için axios
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Loader, Calendar ve Tag ikonlarını import et
import { Loader2, Calendar, Tag } from 'lucide-react'; // Calendar ve Tag ikonları eklendi

// blogApi, STATIC_FILES_DOMAIN ve BlogPostType'ı import et
import { blogApi, STATIC_FILES_DOMAIN } from '../lib/api';
// types.ts dosyanızdan gerekli tipleri import edin
import { Course, Project, UserProfile as GlobalUserProfileType, ApiErrorResponseData, BlogPost as BlogPostType, ApiError } from '../lib/types';

// UserProfile arayüzü - Backend'den gelen profil yapısına uygun olmalı
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  joinDate?: Date | string;
  createdAt?: Date | string;
  projects?: Project[];
  courses?: Course[];
  role?: 'user' | 'admin';
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


const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { userInfo, token: authToken, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userBlogPosts, setUserBlogPosts] = useState<BlogPostType[]>([]);
  const [blogPostsLoading, setBlogPostsLoading] = useState(true);
  const [blogPostsError, setBlogPostsError] = useState<string | null>(null);

  const isOwnProfile = userInfo?._id === userId;

  const mongoObjectIdPattern = /^[0-9a-fA-F]{24}$/;


  // Ana Profil verisini çeken useEffect
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !mongoObjectIdPattern.test(userId)) {
          console.warn(`Profile.tsx: Geçersiz userId formatı (${userId}). API isteği atlanıyor.`);
          setLoading(false);
          setProfile(null);
          return;
      }

      if (!authToken) {
        setError('Profil bilgilerini görüntülemek için oturum açmanız gerekiyor.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<UserProfile>(
            `http://localhost:5000/api/users/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
        });

        console.log('API Profile Response Data:', response.data);
        console.log('Profile Avatar Value from API:', response.data.avatar); // <-- Frontend'in API'den aldığı avatar yolu

        setProfile(response.data);
      } catch (err) {
        console.error('Profil yüklenirken detaylı hata:', err);
        let errorMessage = 'Profil yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';

        if (isBasicAxiosErrorShape(err)) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             const axiosErr = err as any;
             errorMessage = (axiosErr.response?.data as ApiErrorResponseData)?.message || axiosErr.message || errorMessage;
        } else if (err instanceof Error) {
           errorMessage = err.message;
        }
        setError(errorMessage);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
        if (authToken && userId && mongoObjectIdPattern.test(userId)) {
            fetchProfile();
        } else if (!authToken) {
            setError('Profil bilgilerini görüntülemek için oturum açmanız gerekiyor.');
            setLoading(false);
        } else if (userId && !mongoObjectIdPattern.test(userId)) {
            setLoading(false);
            setProfile(null);
        }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, authToken, authLoading]);


  // Kullanıcının Blog Yazılarını çeken yeni useEffect
  useEffect(() => {
      const fetchUserBlogPosts = async () => {
        if (!userId || !mongoObjectIdPattern.test(userId)) {
           setBlogPostsLoading(false);
           setUserBlogPosts([]);
           return;
        }

        setBlogPostsLoading(true);
        setBlogPostsError(null);

        try {
          const posts = await blogApi.getAll(userId);
          setUserBlogPosts(posts);
        } catch (err) {
          console.error("Kullanıcının blog yazılarını çekerken hata:", err);
           let errorMessage = 'Blog yazıları yüklenemedi.';
            const apiErr = err as ApiError;
            errorMessage = apiErr.message || (err instanceof Error ? apiErr.message : 'Bilinmeyen hata.');

          setBlogPostsError(errorMessage);
          setUserBlogPosts([]);
        } finally {
          setBlogPostsLoading(false);
        }
      };

      if (userId && mongoObjectIdPattern.test(userId)) {
          fetchUserBlogPosts();
      } else {
          setBlogPostsLoading(false);
           setUserBlogPosts([]);
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);


  // --- Render Edilecek JSX ---

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

  if (error) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4">
          <div className="bg-destructive/10 text-destructive p-6 rounded-lg text-center max-w-md">
             <h2 className="text-xl font-semibold mb-2">Bir Hata Oluştu</h2>
            <p>{error}</p>
            <Link to="/" className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          <p className="text-xl text-muted-foreground">Profil bulunamadı veya yüklenemedi.</p>
           {userId && !mongoObjectIdPattern.test(userId) && (
               <p className="text-md text-muted-foreground mt-2">Geçersiz kullanıcı ID formatı.</p>
           )}
        </div>
        <Footer />
      </>
    );
  }

  const displayJoinDate = profile.createdAt || profile.joinDate;

  // Avatar URL'sini oluştururken cache'i kırmak için timestamp ekle
  // profile.avatar null, undefined veya boş string olabilir
  let finalAvatarSrc = '/default-avatar.png'; // Varsayılan olarak default resmi ata

  if (profile.avatar) { // Eğer avatar yolu varsa (null/undefined değilse)
       // URL oluştur (backend yolu veya tam URL olabilir)
       const basePath = profile.avatar.startsWith('http')
          ? profile.avatar
          : `${STATIC_FILES_DOMAIN}${profile.avatar.startsWith('/') ? profile.avatar : '/' + profile.avatar}`;

       // Eğer oluşturulan yol hala varsayılan değilse cache kırıcı ekle
       if (basePath && basePath !== '/default-avatar.png') { // basePath boş string veya null değilse ve varsayılan değilse
          finalAvatarSrc = `${basePath}?v=${new Date().getTime()}`; // <-- Cache kırıcı parametre eklendi
       } else {
           // Eğer backend default yolu döndürüyorsa veya yol boşsa, cache kırıcı ekleme
           finalAvatarSrc = basePath || '/default-avatar.png'; // Yol boş string ise varsayılanı kullan
       }
  }
  // Eğer profile.avatar baştan yoksa (null/undefined), finalAvatarSrc zaten '/default-avatar.png' olarak kalır.

  // Debugging için, render sırasında finalAvatarSrc'yi kontrol edelim
  console.log("Profile.tsx - Rendered finalAvatarSrc:", finalAvatarSrc); // <-- Render edilen URL'yi kontrol edin


  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Profil Bilgileri Kartı */}
          <div className="bg-card text-card-foreground shadow-xl rounded-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-primary mb-4 sm:mb-0 flex-shrink-0">
                {/* Avatar görseli - Oluşturulan finalAvatarSrc kullanıldı */}
                <img
                  src={finalAvatarSrc} // <-- Cache kırıcı URL buraya geliyor
                  alt={profile.name ? `${profile.name} avatarı` : 'Kullanıcı avatarı'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                     console.error("Failed to load avatar:", e.currentTarget.src);
                     e.currentTarget.src = '/default-avatar.png'; // Hata olursa varsayılanı kullan
                     e.currentTarget.classList.add('object-contain');
                  }}
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
                      to={`/profile/edit`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Profili Düzenle
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blog Yazıları Kartı - Yeni Bölüm */}
           <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Blog Yazıları</h2>
              {/* Blog yazıları yükleme, hata veya boş liste durumları */}
              {blogPostsLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-muted-foreground">Blog yazıları yükleniyor...</p>
                  </div>
              ) : blogPostsError ? (
                   <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-md">
                      <p className="font-semibold">Blog yazıları yüklenirken hata:</p>
                      <p className="text-sm">{blogPostsError}</p>
                   </div>
              ) : userBlogPosts.length > 0 ? (
                  <ul className="space-y-4">
                      {/* Her bir blog yazısını listele */}
                      {userBlogPosts.map((post) => (
                          // Her bir blog yazısını listele ve detay sayfasına link ver
                          // li elementi bir kart gibi şekillendirildi
                          <li key={post._id} className="p-4 bg-background rounded-md shadow hover:shadow-md transition-shadow flex flex-col">
                              <Link to={`/blog/${post._id}`} className="block">
                                  <h3 className="font-medium text-xl text-primary hover:underline">{post.title}</h3>

                                  {/* Tarih ve Kategori bilgilerini içeren div */}
                                  <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2 space-x-4">
                                      {post.createdAt && (
                                          <div className="flex items-center">
                                               <Calendar className="mr-1.5 h-4 w-4" />
                                               <span>{new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                          </div>
                                      )}
                                       {post.category && (
                                          <div className="flex items-center">
                                               <Tag className="mr-1.5 h-4 w-4" />
                                               <span>{post.category}</span>
                                          </div>
                                      )}
                                  </div>

                                  <p className="text-sm text-muted-foreground line-clamp-2 break-words">{post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '')}</p>
                              </Link>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-muted-foreground">Henüz hiç blog yazısı yayınlanmamış.</p>
              )}
          </div>


          {/* Projeler ve Katıldığı Kurslar Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Projeler Kartı */}
            <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Projeler</h2>
              {profile.projects && profile.projects.length > 0 ? (
                <ul className="space-y-3">
                  {profile.projects.map((project) => (
                    <li key={project._id} className="p-3 bg-background rounded-md shadow hover:shadow-md transition-shadow">
                       {project.projectUrl ? (
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="block">
                               <h3 className="font-medium text-lg text-primary hover:underline">{project.title} <span className="inline-block align-middle"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span></h3>
                          </a>
                       ) : (
                           <h3 className="font-medium text-lg text-primary">{project.title}</h3>
                       )}

                      {project.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">{project.description.substring(0, 100)}{project.description.length > 100 && "..."}</p>}
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
                  {profile.courses.map((course) => (
                    <li key={course._id} className="p-3 bg-background rounded-md shadow hover:shadow-md transition-shadow">
                       {course._id ? (
                          <Link to={`/courses/${course._id}`} className="block">
                               <h3 className="font-medium text-lg text-primary hover:underline">{course.title}</h3>
                          </Link>
                       ) : (
                            <h3 className="font-medium text-lg text-primary">{course.title}</h3>
                       )}

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
      </main>
      <Footer />
    </>
  );
};

export default Profile;