import { Link, useParams } from 'react-router';
import { ROUTES } from '@/router/paths';
import { useOrder } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/format';
import { PAYMENT_METHODS, SHIPPING_METHODS, formatAddress } from '@/lib/checkout';
import ErrorState from '@/components/common/ErrorState';

const dateFormatter = new Intl.DateTimeFormat('th-TH', { dateStyle: 'long', timeStyle: 'short' });

/**
 * หน้าสรุปคำสั่งซื้อ: ใช้ id จาก URL (/order/:id) ขอข้อมูลล่าสุดจาก API แล้วแสดงรายการและที่อยู่
 * ถ้าจะแก้รูปแบบข้อมูลคำสั่งซื้อ ให้ดู types/order.ts และ api/books.ts ด้วย
 */
export default function OrderSuccessPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: order, isPending, isError, error, refetch } = useOrder(id);

  if (isPending) return <div className="skeleton mx-auto h-96 w-full max-w-2xl" />;
  if (isError) return <ErrorState message={error.message} onRetry={() => void refetch()} />;

  const shipping = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);
  const payment = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);
  const paid = order.status === 'paid';

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success text-3xl text-success-content">
          ✓
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">สั่งซื้อสำเร็จ</h1>
        <p className="mt-2 opacity-70">
          หมายเลขคำสั่งซื้อ <span className="font-mono font-semibold">#{order.id}</span>
        </p>
        <p className="text-sm opacity-70">{dateFormatter.format(new Date(order.createdAt))}</p>
        <span className={`badge mt-3 ${paid ? 'badge-success' : 'badge-warning'}`}>
          {paid ? 'ชำระเงินแล้ว' : 'รอชำระเงินปลายทาง'}
        </span>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <h2 className="card-title">รายการสินค้า</h2>
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.bookId} className="flex items-center gap-3">
                <img src={item.coverUrl} alt="" className="h-16 w-11 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-medium">{item.title}</p>
                  <p className="text-sm opacity-70">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="divider my-0" />
          <div className="flex justify-between">
            <span>ราคาสินค้า</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>ค่าจัดส่ง ({shipping?.label})</span>
            <span>{order.shippingFee === 0 ? 'ฟรี' : formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>ยอดรวม</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body gap-1">
            <h2 className="card-title text-base">จัดส่งถึง</h2>
            <p className="font-medium">
              {order.address.recipientName} · {order.address.phone}
            </p>
            <p className="text-sm">{formatAddress(order.address)}</p>
            <p className="mt-1 text-sm opacity-70">
              {shipping?.label} ({shipping?.description})
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body gap-1">
            <h2 className="card-title text-base">การชำระเงิน</h2>
            <p>{payment?.label}</p>
            <p className="text-sm opacity-70">{payment?.description}</p>
          </div>
        </div>
      </div>

      <Link to={ROUTES.home} className="btn btn-primary self-center">
        เลือกซื้อหนังสือต่อ
      </Link>
    </section>
  );
}
