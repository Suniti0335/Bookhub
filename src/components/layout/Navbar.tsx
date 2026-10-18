import { Link, NavLink } from 'react-router';
import { ROUTES } from '@/router/paths';
import { selectTotalQuantity, useCartStore } from '@/store/useCartStore';
import { selectFavoriteCount, useFavoritesStore } from '@/store/useFavoritesStore';
import { HeartIcon } from '@/components/book/FavoriteButton';

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.home, label: 'หนังสือทั้งหมด' },
  { to: ROUTES.cart, label: 'ตะกร้าสินค้า' },
  { to: ROUTES.favorites, label: 'รายการโปรด' },
  { to: ROUTES.about, label: 'เกี่ยวกับเรา' },
];

// ใช้ class ของ DaisyUI ระบุเมนูที่ตรงกับ URL ปัจจุบัน
const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  isActive ? 'menu-active font-semibold' : '';

export default function Navbar() {
  const totalQuantity = useCartStore(selectTotalQuantity);
  const favoriteCount = useFavoritesStore(selectFavoriteCount);

  // สร้างลิงก์ชุดเดียวแล้วนำไปแสดงทั้งเมนูมือถือและเดสก์ท็อป
  const links = NAV_ITEMS.map((item) => (
    <li key={item.to}>
      <NavLink to={item.to} end={item.to === ROUTES.home} className={navLinkClass}>
        {item.label}
      </NavLink>
    </li>
  ));

  return (
    <header className="sticky top-0 z-30 bg-base-100 shadow-sm">
      <nav className="navbar container mx-auto px-4">
        <div className="navbar-start">
          {/* เมนูมือถือ */}
          <div className="dropdown">
            <button type="button" tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="เปิดเมนู">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <ul tabIndex={0} className="menu dropdown-content menu-sm z-40 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
              {links}
            </ul>
          </div>
          <Link to={ROUTES.home} aria-label="BookHub - หน้าหลัก" className="btn btn-ghost text-xl font-extrabold tracking-tight">
            <span className="text-base-content">Book</span>
            <span className="-ml-2 text-primary">Hub</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">{links}</ul>
        </div>

        <div className="navbar-end">
          <NavLink to={ROUTES.favorites} className="btn btn-ghost btn-circle" aria-label="รายการโปรด">
            <div className="indicator">
              <HeartIcon filled={favoriteCount > 0} className="h-5 w-5" />
              {favoriteCount > 0 && (
                <span className="badge indicator-item badge-sm badge-error">{favoriteCount}</span>
              )}
            </div>
          </NavLink>
          <NavLink to={ROUTES.cart} className="btn btn-ghost btn-circle" aria-label="ตะกร้าสินค้า">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalQuantity > 0 && (
                <span className="badge indicator-item badge-sm badge-primary">{totalQuantity}</span>
              )}
            </div>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
