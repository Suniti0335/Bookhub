import { useMemo } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/router/paths';
import { useBooks } from '@/hooks/useBooks';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import BookGrid from '@/components/book/BookGrid';
import BookGridSkeleton from '@/components/book/BookGridSkeleton';
import ErrorState from '@/components/common/ErrorState';
import type { Book } from '@/types/book';

/**
 * หน้ารายการโปรด: ใช้ ID จาก Zustand จับคู่กับหนังสือจาก TanStack Query
 * แก้การบันทึก/ลบรายการได้ที่ store/useFavoritesStore.ts โดยไม่เก็บข้อมูลหนังสือซ้ำใน store
 */
export default function FavoritesPage() {
  const ids = useFavoritesStore((state) => state.ids);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const { data, isPending, isError, error, refetch } = useBooks();

  // join bookId จาก store กับข้อมูลหนังสือจาก TanStack Query (เรียงตามลำดับที่กดถูกใจ)
  const { books, missingIds } = useMemo(() => {
    const byId = new Map((data ?? []).map((book) => [book.id, book]));
    const found: Book[] = [];
    const missing: string[] = [];
    for (const id of ids) {
      const book = byId.get(id);
      if (book) found.push(book);
      else missing.push(id);
    }
    return { books: found, missingIds: missing };
  }, [ids, data]);

  const heading = (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-2xl font-bold md:text-3xl">
        รายการโปรด{ids.length > 0 && ` (${ids.length})`}
      </h1>
      {ids.length > 0 && (
        <button type="button" className="btn btn-ghost btn-sm text-error" onClick={clearFavorites}>
          ล้างรายการโปรด
        </button>
      )}
    </div>
  );

  if (ids.length === 0) {
    return (
      <section>
        {heading}
        <div className="py-16 text-center">
          <p className="mb-4">ยังไม่มีหนังสือในรายการโปรด กดไอคอน ♥ ที่หนังสือเพื่อบันทึกไว้</p>
          <Link to={ROUTES.home} className="btn btn-primary">
            เลือกดูหนังสือ
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      {heading}
      {isPending ? (
        <BookGridSkeleton count={Math.min(ids.length, 10)} />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          {missingIds.length > 0 && (
            <div role="alert" className="alert alert-warning alert-soft">
              <span className="flex-1">มีหนังสือ {missingIds.length} รายการที่ไม่มีในระบบแล้ว</span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => missingIds.forEach((id) => removeFavorite(id))}
              >
                ลบออก
              </button>
            </div>
          )}
          {books.length > 0 && <BookGrid books={books} />}
        </div>
      )}
    </section>
  );
}
