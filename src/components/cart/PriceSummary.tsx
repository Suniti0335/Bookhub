import type { ReactNode } from 'react';
import { formatPrice } from '@/lib/format';

interface PriceSummaryProps {
  subtotal: number;
  shippingFee?: number;
  /** ข้อความแทนค่าส่ง เช่น "คำนวณในขั้นตอนถัดไป" */
  shippingNote?: string;
  children?: ReactNode;
}

export default function PriceSummary({ subtotal, shippingFee, shippingNote, children }: PriceSummaryProps) {
  const total = subtotal + (shippingFee ?? 0);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <h2 className="card-title">สรุปยอด</h2>
        <div className="flex justify-between">
          <span>ราคาสินค้า</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>ค่าจัดส่ง</span>
          <span>
            {shippingFee === undefined
              ? (shippingNote ?? '-')
              : shippingFee === 0
                ? <span className="text-success">ฟรี</span>
                : formatPrice(shippingFee)}
          </span>
        </div>
        <div className="divider my-0" />
        <div className="flex justify-between text-lg font-bold">
          <span>ยอดรวม</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
