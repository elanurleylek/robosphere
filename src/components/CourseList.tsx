// src/components/CourseList.tsx

import React, { useEffect, useState } from 'react';
import { Course } from '../lib/types';
import { courseApi } from '../lib/api';

function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await courseApi.getAll();
        setCourses(data);
      } catch (error) {
        console.error("Kursları çekerken hata oluştu:", error);
        let errorMessage = 'Beklenmeyen bir hata oluştu.';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else {
          errorMessage = String(error);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto my-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Kurslarımız</h2>

      {loading && (
        <div className="flex justify-center items-center text-blue-600">
          <p>Kurslar yükleniyor...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="font-semibold mb-2">Kurslar yüklenirken bir sorun oluştu!</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 text-gray-700">Lütfen backend sunucusunun (<a href="http://localhost:5000/" className="underline" target="_blank" rel="noopener noreferrer">http://localhost:5000/</a>) çalıştığından emin olun.</p>
        </div>
      )}

      {!loading && !error && (
        courses.length === 0 ? (
          <p className="text-center text-gray-600">Henüz hiç kurs eklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
                <div className="relative h-48 w-full">
                  <img 
                    src={course.imageUrl || '/placeholder-course.jpg'} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                    {course.instructor && <p>Eğitmen: <span className="font-medium text-gray-700">{course.instructor}</span></p>}
                    {course.duration && <p>Süre: <span className="font-medium text-gray-700">{course.duration} saat</span></p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default CourseList;