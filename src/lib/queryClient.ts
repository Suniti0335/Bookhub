import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ข้อมูลหนังสือเปลี่ยนไม่บ่อย: ถือว่าสดใหม่ 5 นาที, เก็บ cache 30 นาที
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
