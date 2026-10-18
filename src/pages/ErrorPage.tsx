import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { ROUTES } from '@/router/paths';

export default function ErrorPage() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'เกิดข้อผิดพลาดที่ไม่คาดคิด';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 p-4 text-center">
      <h1 className="text-3xl font-bold">เกิดข้อผิดพลาด</h1>
      <p className="text-base-content/70">{message}</p>
      <Link to={ROUTES.home} className="btn btn-primary">
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
