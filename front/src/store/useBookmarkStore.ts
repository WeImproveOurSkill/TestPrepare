// store/useBookmarkStore.ts
import { create } from 'zustand';
import { getEncryptStorage, setEncryptStorage, BookMarkKey } from '../util/encryptStorage';

interface BookmarkState {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  setBookmarks: (arr: number[]) => void;
  loadBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
  bookmarks: [],
  toggleBookmark: (id: number) => {
    set((state) => {
      const exists = state.bookmarks.includes(id);
      const newArr = exists
        ? state.bookmarks.filter((i) => i !== id)
        : [...state.bookmarks, id];
      // 상태 변경 후 EncryptedStorage에도 저장
      setEncryptStorage(BookMarkKey, newArr);
      console.log('newArr',newArr);

      return { bookmarks: newArr };
    });
  },
  setBookmarks: (arr: number[]) => {
    set({ bookmarks: arr });
    setEncryptStorage(BookMarkKey, arr);
  },
  loadBookmarks: async () => {
    const raw = await getEncryptStorage(BookMarkKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {set({ bookmarks: parsed });}
        else if (typeof parsed === 'number') {set({ bookmarks: [parsed] });}
        else {set({ bookmarks: [] });}
      } catch {
        set({ bookmarks: [] });
      }
    } else {
      set({ bookmarks: [] });
    }
  },
}));
