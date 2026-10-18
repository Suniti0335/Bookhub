import { useEffect, useMemo, useRef } from 'react';
import { formatPrice } from '@/lib/format';

interface PromptPayDialogProps {
  open: boolean;
  amount: number;
  busy: boolean;
  onPaid: () => void;
  onClose: () => void;
}

const GRID = 25;

/** สร้างลาย QR ปลอม (ไม่ใช่ QR จริง) จาก seed เพื่อใช้แสดงผลจำลอง */
function useMockQr(seed: number): boolean[] {
  return useMemo(() => {
    let s = Math.floor(seed) || 1;
    const next = () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
    // มุมสามมุมเป็นกรอบสี่เหลี่ยม 7x7 แบบ QR จริง
    const finders: [number, number][] = [[0, 0], [GRID - 7, 0], [0, GRID - 7]];
    return Array.from({ length: GRID * GRID }, (_, i) => {
      const x = i % GRID;
      const y = Math.floor(i / GRID);
      const finder = finders.find(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
      if (finder) {
        const ring = Math.max(Math.abs(x - finder[0] - 3), Math.abs(y - finder[1] - 3));
        return ring !== 2;
      }
      return next() > 0.5;
    });
  }, [seed]);
}

export default function PromptPayDialog({ open, amount, busy, onPaid, onClose }: PromptPayDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const cells = useMockQr(amount);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      <div className="modal-box text-center">
        <h3 className="text-lg font-bold">ชำระเงินผ่านพร้อมเพย์</h3>
        <p className="mt-1 text-sm opacity-70">สแกน QR ด้วยแอปธนาคาร (จำลอง)</p>
        <svg
          viewBox={`0 0 ${GRID} ${GRID}`}
          className="mx-auto my-4 h-48 w-48 rounded bg-white p-2"
          shapeRendering="crispEdges"
          role="img"
          aria-label="QR Code จำลอง"
        >
          {cells.map((on, i) =>
            on ? <rect key={i} x={i % GRID} y={Math.floor(i / GRID)} width={1} height={1} fill="#000" /> : null,
          )}
        </svg>
        <p className="text-2xl font-bold text-primary">{formatPrice(amount)}</p>
        <div className="modal-action justify-center">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            ยกเลิก
          </button>
          <button type="button" className="btn btn-primary" onClick={onPaid} disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />}
            ฉันชำระเงินแล้ว
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit" disabled={busy}>
          close
        </button>
      </form>
    </dialog>
  );
}
