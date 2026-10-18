import { useBooks } from '@/hooks/useBooks';
import BookGrid from '@/components/book/BookGrid';
import BookGridSkeleton from '@/components/book/BookGridSkeleton';
import ErrorState from '@/components/common/ErrorState';

/**
 * หน้าแรก: โหลดรายการหนังสือผ่าน TanStack Query แล้วแสดงตามสถานะ
 * ถ้าจะเปลี่ยนหน้าตาการ์ด ให้แก้ BookGrid/BookCard; ถ้าจะเปลี่ยนแหล่งข้อมูล ให้ดู useBooks และ api/books.ts
 */
export default function MainPage() {
  const { data: books, isPending, isError, error, refetch } = useBooks();

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">หนังสือทั้งหมด</h1>
      {isPending ? (
        <BookGridSkeleton />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : (
        <BookGrid books={books} />
      )}
    </section>
  );
}
