import type { Book } from './book';

/** สิ่งที่เก็บใน Zustand: มีแค่ ID และจำนวน — ไม่เก็บข้อมูลหนังสือซ้ำ */
export interface CartItem {
  bookId: Book['id'];
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface CartActions {
  addItem: (bookId: Book['id'], quantity?: number) => void;
  removeItem: (bookId: Book['id']) => void;
  updateQuantity: (bookId: Book['id'], quantity: number) => void;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;
