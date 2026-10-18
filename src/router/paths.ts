// เปลี่ยน URL ของหน้าได้ที่นี่ แล้วใช้ ROUTES ใน Link/NavLink แทนการเขียน path ซ้ำ
export const ROUTES = {
  home: '/',
  bookDetail: '/book/:id',
  cart: '/cart',
  favorites: '/favorites',
  checkout: '/checkout',
  about: '/about',
  orderSuccess: '/order/:id',
} as const;

// Helper สำหรับสร้าง URL แบบ dynamic โดย encode id ให้ใช้ใน path ได้อย่างปลอดภัย
export const toBookDetail = (id: string): string => `/book/${encodeURIComponent(id)}`;
export const toOrderSuccess = (id: string): string => `/order/${encodeURIComponent(id)}`;
