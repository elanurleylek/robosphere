// src/lib/api.ts
import {
  Course, CourseCreatePayload, CourseUpdatePayload,
  Project, ProjectCreatePayload, ProjectUpdatePayload,
  Review, ReviewCreatePayload, ReviewUser,
  BlogPost, BlogCreatePayload, BlogUpdatePayload,
  ApiError
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const STATIC_FILES_DOMAIN = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL.includes('/api')
  ? API_BASE_URL.substring(0, API_BASE_URL.indexOf('/api'))
  : API_BASE_URL;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status} ${response.statusText}`;
    let errorDetails: unknown;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
         errorDetails = await response.json();
         if (typeof errorDetails === 'object' && errorDetails !== null && 'message' in errorDetails && typeof (errorDetails as { message: unknown }).message === 'string') {
             errorMessage = (errorDetails as { message: string }).message;
         } else if (typeof errorDetails === 'string') {
            errorMessage = errorDetails;
         } else {
             errorDetails = { originalResponse: errorDetails, status: response.status, statusText: response.statusText };
         }
      } else {
        const errorText = await response.text().catch(() => "Yanıt içeriği okunamadı veya boş.");
        errorDetails = { message: errorText || `Durum: ${response.status}` };
        errorMessage = `HTTP ${response.status}: ${errorText.substring(0,150) || 'Sunucudan beklenmeyen yanıt.'}`;
      }
    } catch (e) {
        console.warn("API Hatası işlenirken ek hata (handleResponse):", e);
    }

    const errorToThrow: ApiError = new Error(errorMessage);
    errorToThrow.details = errorDetails;
    errorToThrow.status = response.status;
    throw errorToThrow;
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204) {
    return null as unknown as T;
  }
  if (contentType && contentType.includes("application/json")) {
     try {
        const text = await response.text();
        return text ? JSON.parse(text) : (null as unknown as T);
     }
     catch (e) {
         console.error("Başarılı yanıtta JSON parse hatası (handleResponse):", e);
         throw new Error('Sunucudan gelen başarılı JSON yanıtı işlenemedi.');
     }
  }
  try {
    const textData = await response.text();
    return textData as unknown as T;
  }
  catch (e) {
    console.error("Başarılı text yanıtta hata (handleResponse):", e);
    return null as unknown as T;
  }
};

const getAuthHeaders = (isFormData: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('userToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const courseApi = {
  getAll: async (): Promise<Course[]> => handleResponse<Course[]>(await fetch(`${API_BASE_URL}/courses`)),
  getById: async (id: string): Promise<Course> => handleResponse<Course>(await fetch(`${API_BASE_URL}/courses/${id}`)),
  create: async (courseData: CourseCreatePayload): Promise<Course> => handleResponse<Course>(await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(courseData),
  })),
  update: async (id: string, courseData: CourseUpdatePayload): Promise<Course> => handleResponse<Course>(await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(courseData),
  })),
  delete: async (id: string): Promise<void | { message: string }> => handleResponse<void | { message: string }>(await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  })),
  enrollToCourse: async (courseId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

export const projectApi = {
  getAll: async (): Promise<Project[]> => handleResponse<Project[]>(await fetch(`${API_BASE_URL}/projects`)),
  getById: async (id: string): Promise<Project> => handleResponse<Project>(await fetch(`${API_BASE_URL}/projects/${id}`)),
  create: async (projectData: ProjectCreatePayload): Promise<Project> => handleResponse<Project>(await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(projectData),
  })),
  update: async (id: string, projectData: ProjectUpdatePayload): Promise<Project> => handleResponse<Project>(await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(projectData),
  })),
  delete: async (id: string): Promise<void | { message: string }> => handleResponse<void | { message: string }>(await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  })),
};

export const blogApi = {
  getAll: async (): Promise<BlogPost[]> => handleResponse<BlogPost[]>(await fetch(`${API_BASE_URL}/blogposts`)),
  getById: async (id: string): Promise<BlogPost> => handleResponse<BlogPost>(await fetch(`${API_BASE_URL}/blogposts/${id}`)),
  create: async (payloadOrFormData: BlogCreatePayload | FormData): Promise<BlogPost> => {
    const isFormData = payloadOrFormData instanceof FormData;
    return handleResponse<BlogPost>(await fetch(`${API_BASE_URL}/blogposts`, {
      method: 'POST', 
      headers: getAuthHeaders(isFormData), 
      body: isFormData ? payloadOrFormData : JSON.stringify(payloadOrFormData),
  }))},
  update: async (id: string, payloadOrFormData: BlogUpdatePayload | FormData): Promise<BlogPost> => {
    const isFormData = payloadOrFormData instanceof FormData;
    return handleResponse<BlogPost>(await fetch(`${API_BASE_URL}/blogposts/${id}`, {
      method: 'PUT', 
      headers: getAuthHeaders(isFormData), 
      body: isFormData ? payloadOrFormData : JSON.stringify(payloadOrFormData),
  }))},
  delete: async (id: string): Promise<void | { message: string }> => handleResponse<void | { message: string }>(await fetch(`${API_BASE_URL}/blogposts/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  })),
};

export const reviewApi = {
  // Yorumlar sadece kurslar içinse:
  getReviews: async (courseId: string): Promise<Review[]> =>
    handleResponse<Review[]>(await fetch(`${API_BASE_URL}/courses/${courseId}/reviews`)),

  createReview: async (courseId: string, payload: ReviewCreatePayload): Promise<Review> =>
    handleResponse<Review>(await fetch(`${API_BASE_URL}/courses/${courseId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })),
};