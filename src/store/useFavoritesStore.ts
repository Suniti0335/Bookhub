import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Book } from '@/types/book';

interface FavoritesState {
  /** เก็บเฉพาะ bookId (ล่าสุดอยู่หน้าสุด) — ข้อมูลหนังสือดึงผ่าน TanStack Query */
  ids: Book['id'][];
}

interface FavoritesActions {
  toggleFavorite: (bookId: Book['id']) => void;
  removeFavorite: (bookId: Book['id']) => void;
  clearFavorites: () => void;
}

export type FavoritesStore = FavoritesState & FavoritesActions;

/**
 * Favorites Store (Client State)
 * - persist ลง localStorage เพื่อให้รายการโปรดคงอยู่หลังรีเฟรช
 */
export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      ids: [],

      toggleFavorite: (bookId) =>
        set((state) => ({
          ids: state.ids.includes(bookId)
            ? state.ids.filter((id) => id !== bookId)
            : [bookId, ...state.ids],
        })),

      removeFavorite: (bookId) =>
        set((state) => ({ ids: state.ids.filter((id) => id !== bookId) })),

      clearFavorites: () => set({ ids: [] }),
    }),
    {
      name: 'booknest-favorites',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state): FavoritesState => ({ ids: state.ids }),
    },
  ),
);

export const selectFavoriteCount = (state: FavoritesStore): number => state.ids.length;

export const selectIsFavorite =
  (bookId: string) =>
  (state: FavoritesStore): boolean =>
    state.ids.includes(bookId);
