// src/App.tsx

import React from 'react'; // JSX kullandığımız için React import edilmeli

// --- Genel Providers Importları ---
import { Toaster } from "@/components/ui/toaster"; // Shadcn toast provider
import { Toaster as Sonner } from "@/components/ui/sonner"; // Sonner toast provider (Eğer kullanıyorsanız)
import { TooltipProvider } from "@/components/ui/tooltip"; // Tooltip provider (Eğer kullanıyorsanız)

// React Query Providers (Eğer kullanıyorsanız)
// Eğer projenizde React Query kullanmıyorsanız bu importları ve QueryClientProvider'ı kaldırabilirsiniz.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Router Importları
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- AuthContext Provider Import ---
// src/context/AuthContext.tsx dosyasından AuthProvider'ı import et
import { AuthProvider } from './context/AuthContext';

// --- Component Importları ---
// src/pages klasöründeki tüm sayfa componentlerinizi ve diğer genel componentleri import edin
import Index from "./pages/Index"; // Ana sayfa
import NotFound from "./pages/NotFound"; // 404 sayfası
import Login from "./pages/Login"; // Giriş sayfası
import Register from "./pages/Register"; // Kayıt sayfası

// Kurs Sayfaları
import Courses from "./pages/Courses"; // Ana Kurslar sayfası
import CourseDetail from "./pages/CourseDetail"; // Kurs Detay sayfası

// Projeler Sayfası
import ProjectsPage from "./pages/ProjectsPage"; // Projeler sayfası

// Etkinlik Sayfaları
import Events from "./pages/Events"; // Etkinlikler listesi
import EventDetail from "./pages/EventDetail"; // Etkinlik Detay sayfası

// Blog Sayfaları
import Blog from "./pages/Blog"; // Blog listesi
import BlogPost from "./pages/BlogPostPage"; // Blog Yazısı detay sayfası

// Admin Sayfaları (Nested Routes için Layout ve Çocuk Sayfaları)
// Eğer Admin paneli kullanmıyorsanız bu importları ve Admin ile ilgili rotaları kaldırabilirsiniz.
import AdminLayout from "./pages/admin/AdminLayout"; // Admin Layout componentiniz
import AdminDashboard from "./pages/admin/AdminDashboard"; // Admin Dashboard sayfası
import AdminCourses from "./pages/admin/AdminCourses"; // Admin Kurs Yönetimi sayfası
import AdminEvents from "./pages/admin/AdminEvents"; // Admin Etkinlik Yönetimi sayfası
import AdminUsers from "./pages/admin/AdminUsers"; // Admin Kullanıcı Yönetimi sayfası
import AdminProjects from "./pages/admin/AdminProjects"; // Admin Proje Yönetimi sayfası

// Kullanıcı Profili Sayfaları
import Profile from './pages/Profile'; // Kullanıcı Profili sayfası (Görüntüleme)
import EditProfile from './pages/EditProfile'; // <<< YENİ: Kullanıcı Profili Düzenleme Sayfası

// Lab Sayfası
// Eğer Lab sayfası kullanmıyorsanız bu importu ve ilgili rotayı kaldırabilirsiniz.
import LabPage from "./pages/LabPage"; // Yeni LabPage componentini import et

// AI Chatbot component (Genellikle tüm sayfalarda görünür)
import AIChatbot from '@/components/AIChatbot'; // Chatbot componentini import et


const queryClient = new QueryClient(); // React Query client'ı oluştur (Eğer kullanıyorsanız)

const App = () => (
  // --- React Query Provider (En Dışta olabilir, API çağrıları için) ---
  // Eğer React Query kullanmıyorsanız bu Provider'ı kaldırın.
  <QueryClientProvider client={queryClient}>

    {/* --- AuthProvider (Uygulamanın büyük kısmını ve Router'ı sarmalı) --- */}
    {/* Kullanıcı oturum bilgilerine erişim gerektiren her şey AuthProvider içinde olmalı */}
    <AuthProvider>

      {/* --- Genel UI Provider'lar (Genellikle AuthProvider içinde yer alırlar) --- */}
      {/* Tooltip ve Toaster gibi global UI bileşenleri burada tanımlanabilir */}
      <TooltipProvider> {/* Eğer Tooltip kullanmıyorsanız kaldırın */}
        <Toaster /> {/* Shadcn toast'ları için */}
        <Sonner /> {/* Sonner toast'ları için (Eğer kullanıyorsanız kaldırın) */}

        {/* --- BrowserRouter (URL yönetimi için router'ı tanımlar) --- */}
        <BrowserRouter>

          {/* --- Routes (Farklı URL'ler ile componentleri eşleştirir) --- */}
          <Routes>
            {/* Ana ve Public Rotalar */}
            <Route path="/" element={<Index />} /> {/* Ana sayfa */}
            <Route path="/login" element={<Login />} /> {/* Giriş sayfası */}
            <Route path="/register" element={<Register />} /> {/* Kayıt sayfası */}

            {/* Kurslar Rotaları */}
            <Route path="/courses" element={<Courses />} /> {/* Ana Kurslar listesi */}
            <Route path="/courses/:id" element={<CourseDetail />} /> {/* Belirli bir kursun detay sayfası (dinamik ID) */}

            {/* Projeler Rotaları */}
            <Route path="/projects" element={<ProjectsPage />} /> {/* Projeler listesi sayfası */}

            {/* Etkinlikler Rotaları */}
            <Route path="/events" element={<Events />} /> {/* Etkinlikler listesi */}
            <Route path="/events/:id" element={<EventDetail />} /> {/* Belirli bir etkinliğin detay sayfası (dinamik ID) */}

            {/* Blog Rotaları */}
            <Route path="/blog" element={<Blog />} /> {/* Blog listesi */}
            <Route path="/blog/:id" element={<BlogPost />} /> {/* Belirli bir blog yazısının detay sayfası (dinamik ID) */}

            {/* Kullanıcı Profili Rotaları */}
            <Route path="/profile/:userId" element={<Profile />} />      {/* Belirli bir kullanıcının profilini görüntüleme (dinamik ID) */}
            <Route path="/profile/edit" element={<EditProfile />} />    {/* <<< YENİ ROTA TANIMI: Giriş yapmış kullanıcının profilini düzenleme */}

            {/* Lab Rotası */}
            {/* Eğer Lab sayfası kullanmıyorsanız kaldırın */}
            <Route path="/lab" element={<LabPage />} />

            {/* Admin Rotaları (Nested Rotalar) */}
            {/* Eğer Admin paneli kullanmıyorsanız bu Route bloğunu tamamen kaldırın */}
            {/* Ebeveyn /admin rotası AdminLayout'u render eder ve alt rotalar <Outlet /> içinde gösterilir */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* Çocuk Rotalar (path ebeveyn rotasına göre tanımlanır) */}
              <Route index element={<AdminDashboard />} /> {/* /admin yolu için varsayılan çocuk */}
              <Route path="courses" element={<AdminCourses />} /> {/* /admin/courses yolu */}
              <Route path="events" element={<AdminEvents />} /> {/* /admin/events yolu */}
              <Route path="users" element={<AdminUsers />} />   {/* /admin/users yolu */}
              <Route path="projects" element={<AdminProjects />} /> {/* /admin/projects yolu */}
               {/* İsteğe bağlı: Admin altındaki eşleşmeyen rotalar için özel 404 (veya genel 404'e yönlendir) */}
               {/* <Route path="*" element={<AdminNotFound />} /> */}
            </Route>

            {/* Eşleşmeyen Rotalar İçin 404 Sayfası (Her zaman EN SONDA olmalı, diğer rotalarla çakışmaması için) */}
            <Route path="*" element={<NotFound />} />

          </Routes>
          {/* --- Routes Sonu --- */}

          {/* --- CHATBOT GİBİ TÜM SAYFALARDA GÖRÜNEN COMPONENTLER --- */}
          {/* Header ve Footer genellikle Router dışında, Layout componentleri içinde veya her sayfada manuel import edilir */}
          {/* AIChatbot gibi global UI elementleri BrowserRouter içinde, Routes dışında tanımlanabilir */ }
           <AIChatbot />

        </BrowserRouter>
        {/* --- BrowserRouter Sonu --- */}

      </TooltipProvider>
      {/* --- TooltipProvider Sonu --- */}

    </AuthProvider>
    {/* --- AuthProvider Sonu --- */}

  </QueryClientProvider>
  // --- React Query Provider Sonu ---
);

export default App; // App componentini dışa aktar