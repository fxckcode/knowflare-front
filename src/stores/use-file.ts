import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UseFileStore {
  files: FileList | null;
  setFiles: (files: FileList) => void;
}

export const useFileStore = create(
  persist<UseFileStore>(
    (set) => ({
      files: null,
      setFiles: (files) => set({ files })
    }),
    {
      name: 'files',
      storage: createJSONStorage(() => localStorage)
    }
  )
);