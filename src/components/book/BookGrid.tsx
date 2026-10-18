import BookCard from './BookCard';
import type { Book } from '@/types/book';

interface BookGridProps {
  books: Book[];
}

export const BOOK_GRID_CLASS = 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

export default function BookGrid({ books }: BookGridProps) {
  if (books.length === 0) {
    return <p className="py-16 text-center opacity-70">ยังไม่มีหนังสือในระบบ</p>;
  }

  return (
    <div className={BOOK_GRID_CLASS}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
