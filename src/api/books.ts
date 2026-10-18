import type { Book } from '@/types/book';
import type { NewOrder, Order } from '@/types/order';

// จุดรวมคำขอ HTTP; กำหนด base URL ของ API ได้ด้วย environment variable VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// ตัวช่วยส่ง request และแปลง HTTP error เป็นข้อความให้หน้าเว็บนำไปแสดง
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...init.headers } : init?.headers,
  });
  if (!res.ok) {
    throw new Error(
      res.status === 404 ? 'ไม่พบข้อมูลที่ต้องการ' : `โหลดข้อมูลไม่สำเร็จ (HTTP ${res.status})`,
    );
  }
  return res.json() as Promise<T>;
}

// ฟังก์ชันด้านล่างเป็น API ของทรัพยากรหนังสือ/คำสั่งซื้อ เรียกใช้ผ่าน hooks แทนเรียกจากหน้าโดยตรง
export const fetchBooks = (): Promise<Book[]> => request<Book[]>('/books');

export const fetchBook = (id: string): Promise<Book> =>
  request<Book>(`/books/${encodeURIComponent(id)}`);

export const updateBookStock = (id: string, stock: number): Promise<Book> =>
  request<Book>(`/books/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ stock }),
  });

export const createOrder = (order: NewOrder): Promise<Order> =>
  request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });

export const fetchOrder = (id: string): Promise<Order> =>
  request<Order>(`/orders/${encodeURIComponent(id)}`);
