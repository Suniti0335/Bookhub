import { useQuery } from '@tanstack/react-query';
import { fetchBook, fetchBooks } from '@/api/books';

// Query keys ช่วยให้ cache และ invalidate ข้อมูลหนังสือชุดเดียวกันได้อย่างสม่ำเสมอ
export const bookKeys = {
  all: ['books'] as const,
  detail: (id: string) => ['books', id] as const,
};

/** โหลดรายการหนังสือทั้งหมด; ใช้ในหน้าแรก, ตะกร้า และรายการโปรด */
export function useBooks() {
  return useQuery({
    queryKey: bookKeys.all,
    queryFn: fetchBooks,
  });
}

/** โหลดหนังสือรายเล่มตาม id; ปิด query ไว้ถ้ายังไม่มี id จาก URL */
export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => fetchBook(id),
    enabled: id !== '',
  });
}
