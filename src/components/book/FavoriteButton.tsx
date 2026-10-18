import { selectIsFavorite, useFavoritesStore } from '@/store/useFavoritesStore';

interface FavoriteButtonProps {
  bookId: string;
  title: string;
  className?: string;
  /** แสดงข้อความข้างไอคอน (ใช้ในหน้า Detail) */
  showLabel?: boolean;
}

export function HeartIcon({ filled, className = 'h-5 w-5' }: { filled: boolean; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

export default function FavoriteButton({ bookId, title, className = '', showLabel = false }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore(selectIsFavorite(bookId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const label = isFavorite ? `นำ "${title}" ออกจากรายการโปรด` : `เพิ่ม "${title}" ในรายการโปรด`;

  return (
    <button
      type="button"
      className={`btn ${showLabel ? '' : 'btn-circle btn-sm'} ${isFavorite ? 'text-error' : ''} ${className}`}
      onClick={() => toggleFavorite(bookId)}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
    >
      <HeartIcon filled={isFavorite} />
      {showLabel && (isFavorite ? 'อยู่ในรายการโปรด' : 'เพิ่มในรายการโปรด')}
    </button>
  );
}
