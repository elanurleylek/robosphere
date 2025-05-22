// src/lib/constants.ts

// src/lib/types.ts dosyasından taşıdığınız tipleri import et
import { DifficultyLevel, ProjectFormData } from './types';

// Proje ekleme formu için başlangıç durumu (ProjectsPage.tsx'ten taşındı)
export const initialFormData: ProjectFormData = { // ProjectFormData tipini de kullanıyoruz
  title: '',
  description: '',
  difficulty: '' as DifficultyLevel | '', // Artık import ettiğimiz tipi kullanıyor
  technologies: '', // Frontend'de virgülle ayrılmış string olarak tutuluyor
  imageUrl: '',
  projectUrl: '',
};

// Uygulamanızdaki diğer sabitleri de ileride buraya taşıyabilirsiniz.
// export const MAX_PROJECT_TITLE_LENGTH = 100; // Örnek sabit