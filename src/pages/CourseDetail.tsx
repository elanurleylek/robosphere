import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
// ... (diğer UI component importları aynı kalacak)
import { Card, CardContent } from '@/components/ui/card';
// Accordion artık kullanılmayacağı için kaldırabilirsiniz, ama dursun zarar vermez
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// Tabs bileşenlerini tutalım
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Users, Calendar, BookOpen, Star as StarIcon, CheckCircle, User, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; // Düzeltilmiş import yolu
import {
  Course as CourseType,
  Review as ReviewType,
  ReviewCreatePayload,
  ApiError,
  ReviewUser
} from '@/lib/types';
import { STATIC_FILES_DOMAIN, reviewApi, courseApi } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

// StarRating component (değişiklik yok)
const StarRating: React.FC<{
  rating: number;
  onRating?: (rate: number) => void;
  starSize?: string;
  interactive?: boolean;
}> = ({
  rating,
  onRating,
  starSize = "h-5 w-5",
  interactive = true
}) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={starValue}
            className={cn(
              starValue <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600",
              interactive && onRating && "cursor-pointer hover:text-yellow-300"
            )}
            onClick={() => interactive && onRating && onRating(starValue)}
          />
        );
      })}
    </div>
  );
};

const CourseDetail: React.FC = () => {
  const { id: courseIdFromParams } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo, token, updateUserInfo } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // ... (CourseDetail component'inin geri kalan state ve fonksiyon tanımları öncekiyle aynı) ...
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<ReviewCreatePayload>({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [enrolling, setEnrolling] = useState<boolean>(false);

  const fetchCourseData = useCallback(async () => {
    if (!courseIdFromParams || courseIdFromParams.startsWith('placeholder-')) {
      setError(courseIdFromParams ? "Geçersiz kurs ID'si." : "Kurs ID'si bulunamadı.");
      setLoading(false); setCourse(null); setReviews([]);
      return;
    }

    setLoading(true); setLoadingReviews(true); setError(null);
    try {
      // courseApi.getById çağrısı hala kurs bilgilerini (başlık, eğitmen vs.) getirecek
      const [courseData, courseReviews] = await Promise.all([
        courseApi.getById(courseIdFromParams),
        reviewApi.getReviews(courseIdFromParams)
      ]);
      setCourse(courseData);
      setReviews(courseReviews);

      if (userInfo && courseData && userInfo.enrolledCourseIds && Array.isArray(userInfo.enrolledCourseIds)) {
        const userIsEnrolled = userInfo.enrolledCourseIds.includes(courseData._id);
        setIsEnrolled(userIsEnrolled);
      } else {
        setIsEnrolled(false);
      }

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Veri yüklenirken bilinmeyen bir hata oluştu.');
      console.error("Kurs veya yorum detayı çekilirken hata:", apiError.details || apiError.message || err);
    } finally {
      setLoading(false); setLoadingReviews(false);
    }
  }, [courseIdFromParams, userInfo]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleNewReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleNewReviewRating = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !courseIdFromParams) {
      toast({ title: "Hata", description: "Yorum yapmak için giriş yapmalısınız veya geçerli bir kurs ID'si bulunamadı.", variant: "destructive" });
      return;
    }
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      toast({ title: "Eksik Bilgi", description: "Lütfen puan verin ve yorumunuzu yazın.", variant: "destructive" });
      return;
    }
    setSubmittingReview(true);
    try {
      const createdReview = await reviewApi.createReview(courseIdFromParams, newReview);
      setReviews(prev => [createdReview, ...prev]);
      toast({ title: "Başarılı", description: "Yorumunuz eklendi." });
      setIsReviewModalOpen(false);
      setNewReview({ rating: 0, comment: '' });
      if (course) {
        const newTotalReviews = (course.totalReviews || 0) + 1;
        const currentTotalRating = (course.averageRating || 0) * (course.totalReviews || 0);
        const newAverageRating = (currentTotalRating + createdReview.rating) / newTotalReviews;
        setCourse(prevCourse => prevCourse ? ({ ...prevCourse, averageRating: parseFloat(newAverageRating.toFixed(1)), totalReviews: newTotalReviews }) : null);
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast({ title: "Yorum Eklenemedi", description: apiError.message || 'Yorum eklenirken bir hata oluştu.', variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEnrollCourse = async () => {
    if (!userInfo || !token) {
      toast({ title: "Giriş Gerekli", description: "Kursa kaydolmak için lütfen giriş yapın.", variant: "default" });
      navigate('/login');
      return;
    }
    if (!course || !course._id) {
      toast({ title: "Hata", description: "Kurs bilgileri bulunamadı.", variant: "destructive" });
      return;
    }

    setEnrolling(true);
    try {
      await courseApi.enrollToCourse(course._id);
      toast({ title: "Başarılı!", description: `"${course.title}" kursuna başarıyla kaydoldunuz.` });
      setIsEnrolled(true);
      setCourse(prev => prev ? ({...prev, enrolledStudents: (prev.enrolledStudents || 0) + 1}) : null);

      if (userInfo) {
        const currentCourseIds: string[] = userInfo.enrolledCourseIds ? [...userInfo.enrolledCourseIds] : [];
        if (!currentCourseIds.includes(course._id)) {
          const newCourseIds: string[] = [...currentCourseIds, course._id];
          updateUserInfo({ enrolledCourseIds: newCourseIds });
        }
      }

    } catch (err) {
      const apiError = err as ApiError;
      toast({ title: "Kayıt Başarısız", description: apiError.message || "Kursa kaydolunurken bir hata oluştu.", variant: "destructive" });
    } finally {
      setEnrolling(false);
    }
  };

  // Yüklenme ve hata durumları (değişiklik yok)
  if (loading && !course && !error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Kurs detayları yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-red-600 text-lg mb-4">Hata: {error}</p>
          <Link to="/courses">
            <Button variant="outline">Kurslara Geri Dön</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-lg mb-4">Kurs bulunamadı veya yüklenemedi.</p>
          <Link to="/courses">
            <Button variant="outline">Kurslara Geri Dön</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }


  const formattedStartDate = course.courseStartDate
    ? new Date(course.courseStartDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : "Belirtilmemiş";

  const getReviewUserName = (reviewUser: ReviewUser): string => {
    return reviewUser.username;
  };
  const getReviewUserAvatarFallback = (reviewUser: ReviewUser): string => {
    const name = getReviewUserName(reviewUser);
    return name ? name.substring(0, 2).toUpperCase() : 'K';
  };

  // JSX'in geri kalanı
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <div className="md:w-5/12 lg:w-1/2">
                <div className="rounded-xl overflow-hidden aspect-video md:aspect-[4/3] shadow-lg bg-muted">
                  <img
                    src={course.imageUrl ? (course.imageUrl.startsWith('http') ? course.imageUrl : `${STATIC_FILES_DOMAIN}${course.imageUrl}`) : `${STATIC_FILES_DOMAIN}/default-course.png`}
                    alt={course.title || 'Kurs Görseli'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.warn("Kurs detay resmi yüklenemedi:", (e.target as HTMLImageElement).src, "-> Varsayılan resme geçiliyor.");
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = `${STATIC_FILES_DOMAIN}/default-course.png`;
                    }}
                  />
                </div>
              </div>
              <div className="md:w-7/12 lg:w-1/2 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center"> <User className="h-4 w-4 mr-1.5 text-primary" /> <span>{course.instructor}</span> </div>
                  <div className="flex items-center"> <BookOpen className="h-4 w-4 mr-1.5 text-primary" /> <span>{course.level || 'Tüm Seviyeler'}</span> </div>
                </div>
                <p className="text-foreground/80 mb-6 text-base leading-relaxed line-clamp-4"> {course.description} </p>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-3 mb-6 text-sm">
                  <div className="flex items-center"> <Clock className="h-5 w-5 mr-2 text-primary shrink-0" /> <div> <div className="text-xs text-muted-foreground">Süre</div> <div className="font-medium text-foreground">{course.duration ? `${course.duration} Saat` : 'Belirtilmemiş'}</div> </div> </div>
                  <div className="flex items-center"> <Users className="h-5 w-5 mr-2 text-primary shrink-0" /> <div> <div className="text-xs text-muted-foreground">Öğrenci</div> <div className="font-medium text-foreground">{course.enrolledStudents || 0} kişi</div> </div> </div>
                  <div className="flex items-center"> <Calendar className="h-5 w-5 mr-2 text-primary shrink-0" /> <div> <div className="text-xs text-muted-foreground">Başlangıç</div> <div className="font-medium text-foreground">{formattedStartDate}</div> </div> </div>
                  <div className="flex items-center"> <StarIcon className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400 shrink-0" /> <div> <div className="text-xs text-muted-foreground">Değerlendirme</div> <div className="font-medium text-foreground">{(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0} yorum)</div> </div> </div>
                </div>
                <div className="mt-auto space-y-3">
                  <div className="text-3xl font-bold text-foreground">{course.price != null && course.price > 0 ? `${course.price.toLocaleString('tr-TR')} ₺` : "Ücretsiz"}</div>
                  {isEnrolled ? (
                    <Button className="w-full text-base" size="lg" asChild>
                      <Link to={`/learn/courses/${course._id}`}>
                        <>
                          Kursa Devam Et <ArrowRight className="ml-2 h-5 w-5"/>
                        </>
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full text-base" size="lg" onClick={handleEnrollCourse} disabled={enrolling} >
                      {enrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {course.price != null && course.price > 0 ? 'Kursa Kayıt Ol' : 'Kursa Ücretsiz Başla'}
                      {!enrolling && <ArrowRight className="ml-2 h-5 w-5"/>}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-10 md:py-12 bg-muted/20 dark:bg-muted/5">
          <div className="container px-4 md:px-6 mx-auto">
            {/* Tabs defaultValue'yu yorumlar olarak değiştirin */}
            <Tabs defaultValue="yorumlar" className="w-full">
              {/* TabsList'in içindeki diğer TabsTrigger'ları silin */}
              {/* grid-cols-1 yapabilirsiniz, veya sadece tek bir element olduğu için bırakabilirsiniz */}
              <TabsList className="grid w-full grid-cols-1 mb-6 md:mb-8 bg-muted p-1 rounded-lg mx-auto max-w-sm"> {/* grid-cols-1 ve max-width ekledim */}
                {/* <TabsTrigger value="icerik" ...>...</TabsTrigger> */} {/* Bu satırı sildik */}
                {/* <TabsTrigger value="hedefler" ...>...</TabsTrigger> */} {/* Bu satırı sildik */}
                <TabsTrigger value="yorumlar" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Yorumlar</TabsTrigger>
              </TabsList>
              {/* value="icerik" ve value="hedefler" olan TabsContent'ları silin */}
              {/* <TabsContent value="icerik" ...>...</TabsContent> */} {/* Bu bloğu sildik */}
              {/* <TabsContent value="hedefler" ...>...</TabsContent> */} {/* Bu bloğu sildik */}

              {/* Sadece yorumlar TabsContent'ı kaldı */}
              <TabsContent value="yorumlar" className="mt-2">
                <Card className="shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                      <h3 className="text-xl font-semibold">Öğrenci Yorumları ({loadingReviews ? '...' : reviews.length})</h3>
                      {userInfo && token && (
                        <Dialog
                          open={isReviewModalOpen}
                          onOpenChange={(open) => {
                            setIsReviewModalOpen(open);
                            if (!open) setNewReview({ rating: 0, comment: '' });
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" type="button">
                              Yorum Yap
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Yorumunuzu Ekleyin</DialogTitle>
                              <DialogDescription>
                                Kurs hakkındaki düşüncelerinizi ve puanınızı paylaşın.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
                              <div>
                                <Label htmlFor="rating" className="mb-1.5 block">Puanınız</Label>
                                <StarRating rating={newReview.rating} onRating={handleNewReviewRating} interactive={true} starSize="h-6 w-6" />
                              </div>
                              <div>
                                <Label htmlFor="comment" className="mb-1.5 block">Yorumunuz</Label>
                                <Textarea id="comment" value={newReview.comment} onChange={handleNewReviewChange} placeholder="Düşünceleriniz..." rows={4} required className="resize-none"/>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsReviewModalOpen(false)}>İptal</Button>
                                <Button type="submit" disabled={submittingReview}>
                                  {submittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Gönder
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    {loadingReviews && !reviews.length ? (
                      <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" /> <p className="text-muted-foreground">Yorumlar yükleniyor...</p></div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <Card key={review._id} className="p-4 bg-card border dark:border-slate-700">
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                                <AvatarImage
                                  src={review.user.avatarUrl || `https://avatar.vercel.sh/${getReviewUserName(review.user) || review.user._id}.png?size=40`}
                                  alt={getReviewUserName(review.user)}
                                />
                                <AvatarFallback>{getReviewUserAvatarFallback(review.user)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                  <h4 className="font-semibold text-sm text-foreground">{getReviewUserName(review.user)}</h4>
                                  <time dateTime={review.createdAt} className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </time>
                                </div>
                                <div className="my-1.5">
                                  <StarRating rating={review.rating} interactive={false} starSize="h-4 w-4" />
                                </div>
                                <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{review.comment}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 border border-dashed border-border rounded-md bg-muted/50">
                        <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">Henüz hiç yorum yapılmamış.</p>
                        {userInfo && <p className="text-xs text-muted-foreground mt-1">Bu kursa ilk yorumu siz yapın!</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;