import { useMemo } from 'react';
import { useBooks } from './useBooks';
import { useCartStore } from '@/store/useCartStore';
import type { Book } from '@/types/book';

export interface CartLine {
  book: Book;
  quantity: number;
  lineTotal: number;
  /** จำนวนในตะกร้ามากกว่าสต็อกที่มีอยู่ */
  exceedsStock: boolean;
}

/**
 * รวม ID/จำนวนจาก Zustand เข้ากับข้อมูลหนังสือจาก TanStack Query
 * คำนวณยอดรวมและแจ้งรายการที่หายไปหรือจำนวนในตะกร้าเกิน stock ให้ Cart/Checkout ใช้ร่วมกัน
 */
export function useCartDetails() {
  const items = useCartStore((state) => state.items);
  const booksQuery = useBooks();

  const details = useMemo(() => {
    const byId = new Map((booksQuery.data ?? []).map((book) => [book.id, book]));
    const lines: CartLine[] = [];
    const missingIds: string[] = [];

    for (const item of items) {
      const book = byId.get(item.bookId);
      if (!book) {
        missingIds.push(item.bookId);
        continue;
      }
      lines.push({
        book,
        quantity: item.quantity,
        lineTotal: book.price * item.quantity,
        exceedsStock: item.quantity > book.stock,
      });
    }

    return {
      lines,
      missingIds,
      subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
      hasStockProblem: lines.some((line) => line.exceedsStock),
    };
  }, [items, booksQuery.data]);

  return { ...details, booksQuery };
}
