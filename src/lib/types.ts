// src/lib/types.ts

// --- TEMEL VARLIKLAR (ENTITIES) ---

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration?: number;
  category?: string;
  imageUrl?: string | null;
  price?: number | null;
  level?: 'Başlangıç' | 'Orta Seviye' | 'İleri Seviye' | 'Tüm Seviyeler' | 'Belirtilmemiş';
  enrolledStudents?: number;
  averageRating?: number;
  totalReviews?: number;
  courseStartDate?: string;
  learningObjectives?: string[];
  curriculum?: CourseContentItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseContentItem {
  week: string;
  title: string;
  lessons: string[];
}

// DifficultyLevel tipi
export type DifficultyLevel = 'Kolay' | 'Orta' | 'Zor';

export interface Project {
  _id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel; // DifficultyLevel tipini kullanır
  technologies?: string[];
  imageUrl?: string | null;
  projectUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewUser {
  _id: string;
  username: string;
  avatarUrl?: string | null;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  course: string; // Kurs ID'si
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPostAuthor {
  _id: string;
  username: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: BlogPostAuthor | string; // string ise ID
  excerpt?: string;
  imageUrl?: string | null;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// --- KULLANICI İLE İLGİLİ GENEL TİPLER ---

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string | null;
  enrolledCourseIds?: string[];
  bio?: string | null;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  avatar?: string | null;
  bio?: string;
  joinDate?: string | Date; // joinDate veya createdAt backend'den string/Date gelebilir
  createdAt?: string | Date; // createdAt genellikle Mongoose timestamps'ten gelir
  courses?: Course[];
  projects?: Project[];
}

// --- AUTH İLE İLGİLİ TİPLER ---

export interface UserInfoWithToken extends AuthUser { // AuthUser'ı miras alır
  token: string;
}

export interface AuthContextType {
  userInfo: UserInfoWithToken | null;
  token: string | null;
  loading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUserInfo: (updatedFields: Partial<AuthUser>) => void;
}

// --- FORM VERİ TİPLERİ ---
export interface ProjectFormData {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  technologies: string;
  imageUrl: string;
  projectUrl: string;
}

// --- API İSTEK PAYLOAD'LARI ---
export interface CourseCreatePayload {
  title: string;
  description: string;
  instructor: string;
  category: string;
  duration?: number;
  imageUrl?: string | null;
  price?: number | null;
  level?: Course['level'];
}
export type CourseUpdatePayload = Partial<CourseCreatePayload>;

export interface ProjectCreatePayload {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  technologies?: string[];
  imageUrl?: string | null;
  projectUrl?: string;
}
export type ProjectUpdatePayload = Partial<Omit<ProjectCreatePayload, 'technologies'> & { technologies?: string[] }>;

export interface ReviewCreatePayload {
  rating: number;
  comment: string;
}

export interface BlogCreatePayload {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
}
export type BlogUpdatePayload = Partial<BlogCreatePayload>;

// --- API HATALARI İÇİN ORTAK TİP ---
export interface ApiError extends Error {
  details?: unknown;
  status?: number;
}

// Axios hata yanıtı için daha spesifik bir tip (isteğe bağlı)
// DÜZELTME: Başındaki fazladan 'export' kelimesi silindi
export interface ApiErrorResponseData {
  message?: string; // Backend'den gelen hata mesajı
  error?: unknown;  // Backend'den gelen ek hata detayları
  // Backend'inizde response.data içinde başka alanlar varsa buraya ekleyin
}