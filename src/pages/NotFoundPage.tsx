import { Link } from 'react-router';
import { ROUTES } from '@/router/paths';

/** หน้า 404 สำหรับ URL ที่ไม่ตรงกับ route ใดใน router/index.tsx */
export default function NotFoundPage() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="my-4">ไม่พบหน้าที่คุณต้องการ</p>
      <Link to={ROUTES.home} className="btn btn-primary">
        กลับหน้าหลัก
      </Link>
    </section>
  );
}
