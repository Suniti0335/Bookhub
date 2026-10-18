import { useEffect, useState } from 'react';
import { selectQuantityOf, useCartStore } from '@/store/useCartStore';
import type { Book } from '@/types/book';

interface AddToCartButtonProps {
  book: Book;
  quantity?: number;
  className?: string;
  onAdded?: (added: number) => void;
}

export default function AddToCartButton({ book, quantity = 1, className = '', onAdded }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const inCart = useCartStore(selectQuantityOf(book.id));
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const available = Math.max(0, book.stock - inCart);
  const outOfStock = book.stock <= 0;
  const disabled = available <= 0;

  const handleClick = () => {
    const toAdd = Math.min(quantity, available);
    if (toAdd <= 0) return;
    addItem(book.id, toAdd);
    setJustAdded(true);
    onAdded?.(toAdd);
  };

  let label = 'เพิ่มลงตะกร้า';
  if (outOfStock) label = 'สินค้าหมด';
  else if (disabled) label = 'ครบจำนวนในสต็อกแล้ว';
  else if (justAdded) label = '✓ เพิ่มแล้ว';

  return (
    <button
      type="button"
      className={`btn ${justAdded ? 'btn-success' : 'btn-primary'} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
