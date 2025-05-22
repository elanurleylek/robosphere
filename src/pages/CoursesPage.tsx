// src/pages/CoursesPage.tsx

import React from 'react';
// CourseList componentini src/pages'ten src/components'e göre doğru yoldan import ediyoruz:
import CourseList from '../components/CourseList';

function CoursesPage() {
  // Bu component bir sayfa görevi görüyor. İleride buraya sayfa başlığı, filtreleme
  // gibi sayfa seviyesindeki öğeler eklenebilir. Şimdilik sadece CourseList'i gösteriyoruz.
  return (
    // Sayfa için genel bir kapsayıcı veya layout elemanı ekleyebilirsiniz
    <div>
      {/* Sayfa Başlığı (CourseList componentinin kendi başlığı var, istersen buradan kaldırabilirsin) */}
      {/* <h1 className="text-3xl font-bold text-center my-8">Tüm Kurslar</h1> */}

      {/* CourseList componentini render et */}
      <CourseList />
    </div>
  );
}

// Sayfa componentini dışa aktar
export default CoursesPage;