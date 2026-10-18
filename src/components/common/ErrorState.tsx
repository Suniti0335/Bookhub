interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'เกิดข้อผิดพลาดในการโหลดข้อมูล', onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="alert alert-error alert-soft flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm" onClick={onRetry}>
          ลองใหม่
        </button>
      )}
    </div>
  );
}
