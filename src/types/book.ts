/** ข้อมูลหนังสือที่ได้จาก API (Server State — ดูแลโดย TanStack Query เท่านั้น) */
export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  category: string;
  price: number;
  coverUrl: string;
  publisher: string;
  publishedYear: number;
  pageCount: number;
  isbn: string;
  rating: number;
  stock: number;
}
