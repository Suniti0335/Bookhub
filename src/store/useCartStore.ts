import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartItem, CartState, CartStore } from '@/types/cart';

const MIN_QTY = 1;
const MAX_QTY = 99;

const clampQty = (qty: number): number =>
  Math.min(MAX_QTY, Math.max(MIN_QTY, Math.floor(qty)));

const initialState: CartState = {
  items: [],
};

/**
 * Cart Store (Client State)
 * - เก็บเฉพาะ { bookId, quantity } เท่านั้น
 * - ข้อมูลหนังสือ (ชื่อ, ราคา, รูป) ให้ดึงผ่าน TanStack Query ด้วย bookId
 * - persist ลง localStorage เพื่อให้ตะกร้าคงอยู่หลังรีเฟรช
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...initialState,

      addItem: (bookId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.bookId === bookId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.bookId === bookId
                  ? { ...item, quantity: clampQty(item.quantity + quantity) }
                  : item,
              ),
            };
          }
          const newItem: CartItem = { bookId, quantity: clampQty(quantity) };
          return { items: [...state.items, newItem] };
        }),

      removeItem: (bookId) =>
        set((state) => ({
          items: state.items.filter((item) => item.bookId !== bookId),
        })),

      updateQuantity: (bookId, quantity) =>
        set((state) => ({
          items:
            quantity < MIN_QTY
              ? state.items.filter((item) => item.bookId !== bookId)
              : state.items.map((item) =>
                  item.bookId === bookId ? { ...item, quantity: clampQty(quantity) } : item,
                ),
        })),

      clearCart: () => set(initialState),
    }),
    {
      name: 'booknest-cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // persist เฉพาะ state ไม่ต้องเก็บ function
      partialize: (state): CartState => ({ items: state.items }),
    },
  ),
);

/* ---------- Selectors (คืนค่า primitive เพื่อลดการ re-render) ---------- */

export const selectTotalQuantity = (state: CartStore): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectDistinctCount = (state: CartStore): number => state.items.length;

export const selectQuantityOf =
  (bookId: string) =>
  (state: CartStore): number =>
    state.items.find((item) => item.bookId === bookId)?.quantity ?? 0;
