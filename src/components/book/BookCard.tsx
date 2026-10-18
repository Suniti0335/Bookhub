import { Link } from 'react-router';
import { toBookDetail } from '@/router/paths';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/cart/AddToCartButton';
import FavoriteButton from './FavoriteButton';
import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const detailPath = toBookDetail(book.id);

  return (
    <article className="card relative h-full bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <FavoriteButton
        bookId={book.id}
        title={book.title}
        className="absolute top-2 right-2 z-10 border-none bg-base-100/90 shadow-sm"
      />
      <Link to={detailPath} tabIndex={-1} aria-hidden="true">
        <figure className="aspect-[2/3] rounded-t-box bg-base-200">
          <img src={book.coverUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        </figure>
      </Link>
      <div className="card-body gap-1 p-4">
        <span className="badge badge-ghost badge-sm">{book.category}</span>
        <h2 className="card-title line-clamp-2 text-base">
          <Link to={detailPath} className="hover:underline">
            {book.title}
          </Link>
        </h2>
        <p className="line-clamp-1 text-sm opacity-70">{book.authors.join(', ')}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">{formatPrice(book.price)}</span>
          <span className="text-sm opacity-70">★ {book.rating.toFixed(1)}</span>
        </div>
        <AddToCartButton book={book} className="btn-sm mt-2 w-full" />
      </div>
    </article>
  );
}
