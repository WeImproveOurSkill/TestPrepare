// store/useBookmarkStore.ts
import { create } from 'zustand';
import { fetchGet } from '../util/api';

interface BookmarkState {
  bookmarks: number[];
  isLoading: boolean;
  fetchBookmarks: (certificationId?: number) => Promise<void>;
  addBookmarkLocally: (id: number) => void;
  removeBookmarkLocally: (id: number) => void;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
  bookmarks: [],
  isLoading: false,

  fetchBookmarks: async (certificationId = 1) => {
    set({ isLoading: true });
    try {
      const data = await fetchGet(`exam/book-mark/question?certificationId=${certificationId}`) as Array<{ questionId: number }>;
      const bookmarkIds = data.map(item => item.questionId);
      set({ bookmarks: bookmarkIds, isLoading: false });
    } catch (error) {
      console.error('북마크 목록을 가져오는데 실패했습니다:', error);
      set({ bookmarks: [], isLoading: false });
    }
  },

  // 서버 요청 성공 후 로컬 상태 업데이트용
  addBookmarkLocally: (id: number) => {
    set((state) => ({
      bookmarks: state.bookmarks.includes(id) ? state.bookmarks : [...state.bookmarks, id],
    }));
  },

  removeBookmarkLocally: (id: number) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter(bookmarkId => bookmarkId !== id),
    }));
  },

  clearBookmarks: () => {
    set({ bookmarks: [] });
  },
}));
