import { BOOK_GRID_CLASS } from './BookGrid';

interface BookGridSkeletonProps {
  count?: number;
}

export default function BookGridSkeleton({ count = 10 }: BookGridSkeletonProps) {
  return (
    <div className={BOOK_GRID_CLASS} aria-busy="true" aria-label="กำลังโหลด">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card bg-base-100 shadow-sm">
          <div className="skeleton aspect-[2/3] rounded-b-none" />
          <div className="flex flex-col gap-2 p-4">
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton mt-2 h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
