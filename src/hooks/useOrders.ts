import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, fetchBook, fetchOrder, updateBookStock } from '@/api/books';
import { bookKeys } from './useBooks';
import type { NewOrder } from '@/types/order';

// แยก key ของคำสั่งซื้อออกจากหนังสือเพื่อจัดการ cache รายการสั่งซื้อได้ตรง resource
export const orderKeys = {
  detail: (id: string) => ['orders', id] as const,
};

/** โหลดคำสั่งซื้อหนึ่งรายการสำหรับหน้าสรุปคำสั่งซื้อ */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
    enabled: id !== '',
  });
}

/**
 * สั่งซื้อ:
 * 1. ขอ stock ล่าสุดจาก server เพื่อไม่ใช้ข้อมูล cache เก่าตัดสิน
 * 2. สร้างรายการใน /orders
 * 3. ลด stock และ invalidate cache หนังสือเพื่อให้หน้าต่าง ๆ โหลดค่าล่าสุด
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: NewOrder) => {
      const checked = await Promise.all(
        order.items.map(async (item) => ({ item, book: await fetchBook(item.bookId) })),
      );
      const shortage = checked.find(({ item, book }) => item.quantity > book.stock);
      if (shortage) {
        throw new Error(`"${shortage.item.title}" มีสินค้าไม่พอ กรุณาปรับจำนวนในตะกร้า`);
      }

      const created = await createOrder(order);
      await Promise.all(
        checked.map(({ item, book }) => updateBookStock(book.id, book.stock - item.quantity)),
      );
      return created;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: bookKeys.all }),
  });
}
