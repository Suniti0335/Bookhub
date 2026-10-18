import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useBook } from '@/hooks/useBooks';
import { selectQuantityOf, useCartStore } from '@/store/useCartStore';
import { ROUTES } from '@/router/paths';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/cart/AddToCartButton';
import QuantityInput from '@/components/cart/QuantityInput';
import FavoriteButton from '@/components/book/FavoriteButton';
import ErrorState from '@/components/common/ErrorState';

/**
 * หน้ารายละเอียดหนังสือ: อ่าน id จาก URL (/book/:id) แล้วโหลดหนังสือเล่มนั้นจาก API
 * ปรับข้อมูลที่แสดงได้ในส่วนรายละเอียด; การเพิ่มตะกร้า/รายการโปรดใช้ Zustand ผ่านปุ่มย่อย
 */
export default function BookDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: book, isPending, isError, error, refetch } = useBook(id);
  const inCart = useCartStore(selectQuantityOf(id));
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  if (isPending) {
    return (
      <section className="grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="skeleton aspect-[2/3] w-full" />
        <div className="flex flex-col gap-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-48" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col gap-4">
        <ErrorState message={error.message} onRetry={() => void refetch()} />
        <Link to={ROUTES.home} className="btn btn-ghost self-start">
          ← กลับหน้าหนังสือทั้งหมด
        </Link>
      </section>
    );
  }

  // กันไม่ให้จำนวนที่เลือกเกิน stock หลังหักจำนวนเล่มเดียวกันที่อยู่ในตะกร้าแล้ว
  const available = Math.max(0, book.stock - inCart);
  const qty = Math.min(quantity, Math.max(1, available));

  const details: [string, string | number][] = [
    ['สำนักพิมพ์', book.publisher],
    ['ปีที่พิมพ์', book.publishedYear],
    ['จำนวนหน้า', `${book.pageCount} หน้า`],
    ['ISBN', book.isbn],
    ['หมวดหมู่', book.category],
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <nav aria-label="เส้นทางนำทาง" className="mb-8 text-sm text-base-content/60">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to={ROUTES.home} className="transition-colors hover:text-primary">
              หนังสือทั้งหมด
            </Link>
          </li>
          <li aria-hidden="true" className="text-base-content/30">/</li>
          <li className="max-w-[min(70vw,32rem)] truncate font-medium text-base-content">
            {book.title}
          </li>
        </ol>
      </nav>

      <div className="grid items-start gap-8 md:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] md:gap-10 lg:gap-12">
        <figure className="mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-2xl border border-base-content/10 bg-gradient-to-br from-base-100 to-base-300 p-2 shadow-xl md:mx-0">
          <img
            src={book.coverUrl}
            alt={`ปกหนังสือ ${book.title}`}
            className="h-full w-full rounded-xl object-contain"
          />
        </figure>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-base-content/10 bg-base-100 p-5 shadow-sm sm:p-7">
            <span className="badge badge-primary badge-soft">{book.category}</span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-base-content/65">โดย {book.authors.join(', ')}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-sm font-medium">
              <span className="text-primary" aria-hidden="true">★</span>
              {book.rating.toFixed(1)} / 5
            </p>

            <p className="mt-5 text-3xl font-extrabold text-primary">{formatPrice(book.price)}</p>

            <p className="mt-4 leading-7 text-base-content/80">{book.description}</p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-base-content/10 bg-base-100">
              <table className="table table-zebra">
                <tbody>
                  {details.map(([label, value]) => (
                    <tr key={label}>
                      <th className="w-32 font-normal opacity-70">{label}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-xl border border-base-content/10 bg-base-200/60 p-4 sm:p-5">
              <p className="text-sm">
                {book.stock > 0 ? (
                  <>
                    คงเหลือ <span className="font-semibold">{book.stock}</span> เล่ม
                    {inCart > 0 && <span className="opacity-70"> (อยู่ในตะกร้าแล้ว {inCart} เล่ม)</span>}
                  </>
                ) : (
                  <span className="font-semibold text-error">สินค้าหมด</span>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {available > 0 && <QuantityInput value={qty} max={available} onChange={setQuantity} />}
                <AddToCartButton
                  book={book}
                  quantity={qty}
                  onAdded={(added) => {
                    setQuantity(1);
                    setAddedMessage(`เพิ่ม "${book.title}" จำนวน ${added} เล่มลงตะกร้าแล้ว`);
                  }}
                />
                <FavoriteButton bookId={book.id} title={book.title} showLabel className="btn-outline" />
              </div>
              {addedMessage && (
              <div role="status" className="alert alert-success alert-soft mt-4">
                  <span className="flex-1">{addedMessage}</span>
                  <Link to={ROUTES.cart} className="btn btn-sm">
                    ดูตะกร้า
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
