import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import MainPage from '@/pages/MainPage';
import BookDetailPage from '@/pages/BookDetailPage';
import CartPage from '@/pages/CartPage';
import FavoritesPage from '@/pages/FavoritesPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AboutPage from '@/pages/AboutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorPage from '@/pages/ErrorPage';
import { ROUTES } from './paths';

// รวม URL ของแอปไว้ที่จุดเดียว: หน้าย่อยจะแสดงใน RootLayout ผ่าน <Outlet />
export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: ROUTES.bookDetail, element: <BookDetailPage /> },
      { path: ROUTES.cart, element: <CartPage /> },
      { path: ROUTES.favorites, element: <FavoritesPage /> },
      { path: ROUTES.checkout, element: <CheckoutPage /> },
      { path: ROUTES.about, element: <AboutPage /> },
      { path: ROUTES.orderSuccess, element: <OrderSuccessPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
