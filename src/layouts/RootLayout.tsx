import { Outlet, ScrollRestoration } from 'react-router';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// โครงหน้าที่ใช้ร่วมกันทุก route: Navbar/Footer อยู่คงที่ และ <Outlet /> แสดงหน้าตาม URL
export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />
      <main className="container mx-auto w-full flex-1 px-4 py-6 md:py-10">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
