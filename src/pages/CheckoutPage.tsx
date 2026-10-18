import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { ROUTES, toOrderSuccess } from '@/router/paths';
import { useCartStore } from '@/store/useCartStore';
import { selectSelectedAddress, useAddressStore } from '@/store/useAddressStore';
import { useCartDetails } from '@/hooks/useCartDetails';
import { usePlaceOrder } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/format';
import { PAYMENT_METHODS, SHIPPING_METHODS, getShippingFee } from '@/lib/checkout';
import AddressBook from '@/components/checkout/AddressBook';
import CardForm, { EMPTY_CARD, validateCard, type CardErrors, type CardValues } from '@/components/checkout/CardForm';
import PromptPayDialog from '@/components/checkout/PromptPayDialog';
import PriceSummary from '@/components/cart/PriceSummary';
import ErrorState from '@/components/common/ErrorState';
import type { NewOrder, PaymentMethodId, ShippingMethodId } from '@/types/order';

/**
 * หน้าพิเศษสำหรับสั่งซื้อ: ตรวจที่อยู่/stock คำนวณค่าจัดส่งและยอด แล้วบันทึกคำสั่งซื้อผ่าน usePlaceOrder
 * การชำระเงินในโปรเจกต์นี้เป็นการจำลอง; ปรับวิธีชำระเงิน/ค่าจัดส่งได้ที่ lib/checkout.ts
 */
const SIMULATED_PAYMENT_DELAY_MS = 1200;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// กล่องครอบแต่ละขั้นตอนของ checkout เพื่อให้เพิ่ม/จัดลำดับส่วนต่าง ๆ ได้สะดวก
function StepCard({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <h2 className="card-title">
          <span className="badge badge-primary">{step}</span>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const address = useAddressStore(selectSelectedAddress);
  const { lines, subtotal, hasStockProblem, booksQuery } = useCartDetails();
  const placeOrder = usePlaceOrder();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
  const [card, setCard] = useState<CardValues>(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [promptPayOpen, setPromptPayOpen] = useState(false);

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">ไม่มีสินค้าในตะกร้า</h1>
        <Link to={ROUTES.home} className="btn btn-primary">
          เลือกซื้อหนังสือ
        </Link>
      </section>
    );
  }

  if (booksQuery.isPending) {
    return <div className="skeleton h-96 w-full" />;
  }

  if (booksQuery.isError) {
    return <ErrorState message={booksQuery.error.message} onRetry={() => void booksQuery.refetch()} />;
  }

  const shippingFee = getShippingFee(shippingMethod, subtotal);
  const total = subtotal + shippingFee;
  const busy = processing || placeOrder.isPending;

  const submitOrder = async () => {
    if (!address) return;
    const { id: _id, ...addressSnapshot } = address;
    const order: NewOrder = {
      createdAt: new Date().toISOString(),
      items: lines.map(({ book, quantity }) => ({
        bookId: book.id,
        title: book.title,
        coverUrl: book.coverUrl,
        price: book.price,
        quantity,
      })),
      address: addressSnapshot,
      shippingMethod,
      paymentMethod,
      subtotal,
      shippingFee,
      total,
      status: paymentMethod === 'cod' ? 'pending_payment' : 'paid',
    };

    // บันทึกคำสั่งซื้อที่ API; เมื่อสำเร็จเปิดหน้าสรุปและล้างตะกร้า
    setProcessing(true);
    try {
      if (paymentMethod === 'card') await wait(SIMULATED_PAYMENT_DELAY_MS);
      const created = await placeOrder.mutateAsync(order);
      navigate(toOrderSuccess(created.id), { replace: true });
      clearCart();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'สั่งซื้อไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setProcessing(false);
      setPromptPayOpen(false);
    }
  };

  const handleConfirm = () => {
    // ตรวจข้อมูลที่จำเป็นก่อนเริ่มส่งคำสั่งซื้อ
    setFormError(null);
    if (!address) {
      setFormError('กรุณาเพิ่มหรือเลือกที่อยู่จัดส่ง');
      return;
    }
    if (hasStockProblem) {
      setFormError('มีสินค้าบางรายการเกินจำนวนในสต็อก กรุณากลับไปแก้ไขที่ตะกร้า');
      return;
    }
    if (paymentMethod === 'card') {
      const errors = validateCard(card);
      setCardErrors(errors);
      if (Object.keys(errors).length > 0) {
        setFormError('กรุณาตรวจสอบข้อมูลบัตร');
        return;
      }
    }
    if (paymentMethod === 'promptpay') {
      setPromptPayOpen(true);
      return;
    }
    void submitOrder();
  };

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">ชำระเงิน</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <StepCard step={1} title="ที่อยู่จัดส่ง">
            <AddressBook />
          </StepCard>

          <StepCard step={2} title="วิธีจัดส่ง">
            <div className="flex flex-col gap-2">
              {SHIPPING_METHODS.map((method) => {
                const fee = getShippingFee(method.id, subtotal);
                const checked = shippingMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-box border-2 p-4 ${checked ? 'border-primary bg-primary/5' : 'border-base-300'}`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      className="radio radio-primary"
                      checked={checked}
                      onChange={() => setShippingMethod(method.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm opacity-70">{method.description}</p>
                    </div>
                    <span className="font-semibold">{fee === 0 ? 'ฟรี' : formatPrice(fee)}</span>
                  </label>
                );
              })}
            </div>
          </StepCard>

          <StepCard step={3} title="วิธีชำระเงิน">
            <div className="grid gap-2 sm:grid-cols-3">
              {PAYMENT_METHODS.map((method) => {
                const checked = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-box border-2 p-4 ${checked ? 'border-primary bg-primary/5' : 'border-base-300'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="radio radio-primary radio-sm mt-1"
                      checked={checked}
                      onChange={() => {
                        setPaymentMethod(method.id);
                        setFormError(null);
                      }}
                    />
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-xs opacity-70">{method.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            {paymentMethod === 'card' && <CardForm values={card} errors={cardErrors} onChange={setCard} />}
            {paymentMethod === 'promptpay' && (
              <p className="text-sm opacity-70">ระบบจะแสดง QR Code ให้สแกนหลังกดยืนยันคำสั่งซื้อ</p>
            )}
            {paymentMethod === 'cod' && (
              <p className="text-sm opacity-70">ชำระเงินสด {formatPrice(total)} กับพนักงานเมื่อได้รับสินค้า</p>
            )}
          </StepCard>
        </div>

        <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body gap-3">
              <div className="flex items-center justify-between">
                <h2 className="card-title">รายการสินค้า</h2>
                <Link to={ROUTES.cart} className="link text-sm">
                  แก้ไข
                </Link>
              </div>
              <ul className="flex flex-col gap-3">
                {lines.map(({ book, quantity, lineTotal, exceedsStock }) => (
                  <li key={book.id} className="flex gap-3">
                    <img src={book.coverUrl} alt="" className="h-16 w-11 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{book.title}</p>
                      <p className="text-xs opacity-70">× {quantity}</p>
                      {exceedsStock && <p className="text-xs text-error">เหลือ {book.stock} เล่ม</p>}
                    </div>
                    <span className="text-sm">{formatPrice(lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <PriceSummary subtotal={subtotal} shippingFee={shippingFee}>
            {formError && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                {formError}
              </div>
            )}
            <button type="button" className="btn btn-primary btn-block" onClick={handleConfirm} disabled={busy}>
              {busy && <span className="loading loading-spinner loading-sm" />}
              {busy ? 'กำลังดำเนินการ...' : `ยืนยันคำสั่งซื้อ ${formatPrice(total)}`}
            </button>
          </PriceSummary>
        </div>
      </div>

      <PromptPayDialog
        open={promptPayOpen}
        amount={total}
        busy={busy}
        onPaid={() => void submitOrder()}
        onClose={() => setPromptPayOpen(false)}
      />
    </section>
  );
}
