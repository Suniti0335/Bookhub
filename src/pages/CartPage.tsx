import { Link } from 'react-router';
import { ROUTES, toBookDetail } from '@/router/paths';
import { useCartStore } from '@/store/useCartStore';
import { useCartDetails } from '@/hooks/useCartDetails';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/checkout';
import QuantityInput from '@/components/cart/QuantityInput';
import PriceSummary from '@/components/cart/PriceSummary';
import ErrorState from '@/components/common/ErrorState';

/**
 * หน้าตะกร้า: Zustand เก็บ bookId/จำนวน ส่วน useCartDetails เติมรายละเอียดจาก API และคำนวณยอด
 * การแก้ราคา/ค่าจัดส่งดู lib/checkout.ts; การแก้ข้อมูลที่ดึงจาก API ดู hooks/useCartDetails.ts
 */
export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const { lines, missingIds, subtotal, totalQuantity, hasStockProblem, booksQuery } = useCartDetails();

  if (items.length === 0) {
    return (
      <section>
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">ตะกร้าสินค้า</h1>
        <div className="py-16 text-center">
          <p className="mb-4">ยังไม่มีสินค้าในตะกร้า</p>
          <Link to={ROUTES.home} className="btn btn-primary">
            เลือกซื้อหนังสือ
          </Link>
        </div>
      </section>
    );
  }

  if (booksQuery.isPending) {
    return (
      <section>
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">ตะกร้าสินค้า</h1>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.bookId} className="skeleton h-28 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (booksQuery.isError) {
    return (
      <section>
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">ตะกร้าสินค้า</h1>
        <ErrorState message={booksQuery.error.message} onRetry={() => void booksQuery.refetch()} />
      </section>
    );
  }

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">ตะกร้าสินค้า ({totalQuantity} เล่ม)</h1>
        <button type="button" className="btn btn-ghost btn-sm text-error" onClick={clearCart}>
          ล้างตะกร้า
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {missingIds.length > 0 && (
            <div role="alert" className="alert alert-warning alert-soft">
              <span className="flex-1">มีสินค้า {missingIds.length} รายการที่ไม่มีในระบบแล้ว</span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => missingIds.forEach((id) => removeItem(id))}
              >
                ลบออก
              </button>
            </div>
          )}

          {lines.map(({ book, quantity, lineTotal, exceedsStock }) => (
            <article key={book.id} className="card card-side bg-base-100 shadow-sm">
              <figure className="w-20 shrink-0 bg-base-200 sm:w-24">
                <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
              </figure>
              <div className="card-body gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link to={toBookDetail(book.id)} className="line-clamp-2 font-semibold hover:underline">
                      {book.title}
                    </Link>
                    <p className="text-sm opacity-70">{formatPrice(book.price)} / เล่ม</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square"
                    onClick={() => removeItem(book.id)}
                    aria-label={`ลบ ${book.title}`}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <QuantityInput
                    size="sm"
                    value={quantity}
                    max={Math.max(quantity, book.stock)}
                    onChange={(q) => updateQuantity(book.id, q)}
                  />
                  <span className="font-bold">{formatPrice(lineTotal)}</span>
                </div>
                {exceedsStock && (
                  <p className="text-sm text-error">
                    {book.stock === 0 ? 'สินค้าหมดแล้ว กรุณาลบออกจากตะกร้า' : `เหลือในสต็อกเพียง ${book.stock} เล่ม`}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <PriceSummary subtotal={subtotal} shippingNote="เลือกในขั้นตอนชำระเงิน">
            {remainingForFreeShipping > 0 ? (
              <p className="text-sm opacity-70">
                ซื้อเพิ่มอีก {formatPrice(remainingForFreeShipping)} รับส่งฟรีแบบธรรมดา
              </p>
            ) : (
              <p className="text-sm text-success">ยอดซื้อของคุณได้รับสิทธิ์ส่งฟรีแบบธรรมดา</p>
            )}
            {hasStockProblem ? (
              <button type="button" className="btn btn-primary btn-block" disabled>
                กรุณาปรับจำนวนสินค้า
              </button>
            ) : (
              <Link
                to={ROUTES.checkout}
                className={`btn btn-primary btn-block ${lines.length === 0 ? 'btn-disabled' : ''}`}
              >
                ไปหน้าชำระเงิน
              </Link>
            )}
            <Link to={ROUTES.home} className="btn btn-ghost btn-block">
              เลือกซื้อต่อ
            </Link>
          </PriceSummary>
        </div>
      </div>
    </section>
  );
}
