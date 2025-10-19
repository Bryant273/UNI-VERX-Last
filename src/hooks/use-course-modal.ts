
import { create } from 'zustand';
import type { CourseDocument } from '@/lib/course-data';

interface CourseModalStore {
  isOpen: boolean;
  initialData?: CourseDocument | null;
  onOpen: (data?: CourseDocument | null) => void;
  onClose: () => void;
}

export const useCourseModal = create<CourseModalStore>((set) => ({
  isOpen: false,
  initialData: null,
  onOpen: (data = null) => set({ isOpen: true, initialData: data }),
  onClose: () => set({ isOpen: false, initialData: null }),
}));
