# BookHub — คู่มือทำความเข้าใจและแก้ไขโปรเจกต์

เอกสารนี้สรุปว่าแต่ละส่วนของโปรเจกต์ทำหน้าที่อะไร และควรเริ่มแก้ไฟล์ไหนเมื่อมีการเปลี่ยนแปลง เพื่อให้สมาชิกในทีมและผู้ตรวจงานตามโค้ดได้ง่าย

## เริ่มโปรเจกต์

รันคำสั่งเดียวในโฟลเดอร์โปรเจกต์ (Vite จะเปิด JSON Server ที่พอร์ต 3001 ให้อัตโนมัติ และส่งต่อคำขอ `/api/...` ไปให้):

```powershell
npm run dev
```

ถ้าต้องการเปิด JSON Server แยกเอง ใช้ `npm run api` ได้ (Vite จะตรวจเจอและไม่เปิดซ้ำ)

เปิด URL ที่ Vite แสดง (ปกติคือ `http://localhost:5173`) อย่าเปิดด้วย Live Server เพราะแอปต้องผ่าน Vite เพื่อแปลง React/TypeScript ก่อน

คำสั่งตรวจสอบ:

```powershell
npm run build
npm run typecheck
```

## ภาพรวมการทำงาน

```text
หน้า React
  ├─ เรียก hooks ใน src/hooks/
  │    └─ TanStack Query จัดการข้อมูลจาก API และ cache
  │         └─ src/api/books.ts เรียก JSON Server
  │              └─ db.json
  └─ Zustand stores จัดการข้อมูลเฉพาะผู้ใช้และบันทึกลง localStorage
       ├─ รายการหนังสือในตะกร้า: bookId + quantity
       ├─ รายการโปรด: bookId
       └─ ที่อยู่จัดส่ง: ข้อมูลที่ผู้ใช้บันทึกไว้
```

**หลักสำคัญ:** ข้อมูลหนังสือและคำสั่งซื้อเป็น Server State ให้ดึงผ่าน TanStack Query ส่วน Zustand เก็บ Client State เท่าที่จำเป็น ไม่เก็บสำเนาข้อมูลหนังสือทั้งเล่ม

## แผนที่ไฟล์

| ต้องการแก้ส่วนไหน | เริ่มดูที่ไฟล์ | หน้าที่ |
| --- | --- | --- |
| เพิ่ม/แก้ข้อมูลหนังสือ | `db.json` | ข้อมูลเริ่มต้นที่ JSON Server ส่งให้หน้าเว็บ |
| รูปแบบข้อมูลหนังสือ | `src/types/book.ts` | TypeScript type ของหนังสือ |
| URL และการเรียก API | `src/api/books.ts` | ฟังก์ชันอ่านหนังสือ บันทึกคำสั่งซื้อ และแก้ stock |
| โหลดข้อมูล/จัดการ cache | `src/hooks/useBooks.ts`, `src/hooks/useOrders.ts` | TanStack Query hooks; สร้างคำสั่งซื้อและ refresh cache |
| รายการหนังสือหน้าแรก | `src/pages/MainPage.tsx` | สถานะโหลด/ผิดพลาด และแสดงรายการ |
| หน้ารายละเอียดหนังสือ | `src/pages/BookDetailPage.tsx` | อ่าน `id` จาก URL แล้วโหลดรายละเอียด |
| ตะกร้าและรายการโปรด | `src/store/useCartStore.ts`, `src/store/useFavoritesStore.ts` | Zustand state, actions และการบันทึก localStorage |
| ที่อยู่จัดส่ง | `src/store/useAddressStore.ts` | Zustand state ของสมุดที่อยู่ |
| หน้าตะกร้า/รายการโปรด | `src/pages/CartPage.tsx`, `src/pages/FavoritesPage.tsx` | แสดง collection โดยประกอบ ID จาก store กับข้อมูลจาก Query |
| Checkout และหน้าพิเศษ | `src/pages/CheckoutPage.tsx` | เลือกที่อยู่ วิธีส่ง และวิธีชำระเงิน พร้อมสั่งซื้อ |
| ข้อมูลสมาชิกและ API attribution | `src/pages/AboutPage.tsx` | แก้ `MEMBERS` เมื่อได้ข้อมูลสมาชิกจริง และ `API_SOURCES` เมื่อเปลี่ยนแหล่งข้อมูล |
| URL ของแต่ละหน้า | `src/router/paths.ts` | ค่าคงที่ของ routes และ helper สร้าง URL |
| ผูก URL เข้ากับหน้า | `src/router/index.tsx` | route configuration และหน้าเมื่อเกิด route error |
| เมนูและการนำทาง | `src/components/layout/Navbar.tsx` | ลิงก์เมนูและตัวเลขจำนวนสินค้า/รายการโปรด |
| หน้าตาร่วมของทุกหน้า | `src/layouts/RootLayout.tsx` | Navbar, พื้นที่ `<Outlet />` และ Footer |
| รูปแบบและ theme | `src/index.css` | นำเข้า Tailwind CSS และ DaisyUI |

## ตัวอย่างการแก้ไขที่พบบ่อย

### เพิ่มหนังสือ

1. เพิ่ม object ใหม่ใน array `books` ใน `db.json`
2. กำหนด `id` ที่ไม่ซ้ำ และใส่ฟิลด์ให้ตรงกับ `Book` ใน `src/types/book.ts`
3. JSON Server จะให้ข้อมูลผ่าน `/books`; หน้าเว็บอ่านผ่าน `useBooks()` โดยไม่ต้องคัดลอกหนังสือไปเก็บใน Zustand

### เพิ่มหน้าใหม่

1. สร้างหน้าใน `src/pages/`
2. กำหนด path ใน `src/router/paths.ts`
3. เพิ่ม route ใน `src/router/index.tsx`
4. เพิ่มลิงก์ใน `src/components/layout/Navbar.tsx` หากต้องการให้เข้าถึงจากเมนู

### เปลี่ยนพฤติกรรมตะกร้าหรือรายการโปรด

แก้ action และ state ใน store ที่เกี่ยวข้อง และดู type ใน `src/types/cart.ts` หรือ `src/store/useFavoritesStore.ts` ประกอบ ข้อมูลหนังสือที่นำมาแสดงยังต้องโหลดจาก Query ตาม ID

### เปลี่ยนสถานะโหลดหรือข้อผิดพลาดจาก API

ดูหน้าและ hook ที่เรียกข้อมูลนั้น โดยหน้าที่โหลดข้อมูลควรมี loading state และแสดง `ErrorState` พร้อมปุ่มลองใหม่เมื่อคำขอล้มเหลว

## โครงสร้างโฟลเดอร์หลัก

```text
src/
  api/          ฟังก์ชันติดต่อ API
  components/   ส่วน UI ที่นำกลับมาใช้ซ้ำ
  hooks/        hooks สำหรับข้อมูลและ logic ที่ใช้ร่วมกัน
  layouts/      โครงหน้าโดยรวม
  lib/          helper เช่น format ราคาและกฎ checkout
  pages/        เนื้อหาแต่ละ route
  router/       path และ route configuration
  store/        Zustand client state
  types/        TypeScript types/interfaces
db.json         ข้อมูลตัวอย่างของ JSON Server
```

## ก่อนส่งงาน

- แทนข้อมูลตัวอย่างสมาชิกใน `src/pages/AboutPage.tsx` ด้วยชื่อ-นามสกุล ชื่อเล่น รหัสนักศึกษา หน้าที่ และรูปของสมาชิกจริง
- ตรวจสอบว่า JSON Server และเว็บเปิดได้ พร้อมลองหน้าและเส้นทางหลัก
- รัน `npm run build` และจัดทำภาพหน้าจอ/ZIP ตามโจทย์ก่อนส่ง
