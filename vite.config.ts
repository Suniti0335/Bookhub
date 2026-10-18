import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';

const API_HOST = '127.0.0.1';
const API_PORT = 3001;
const API_TARGET = `http://${API_HOST}:${API_PORT}`;

// เปิด JSON Server ให้อัตโนมัติพร้อม Vite เพื่อไม่ต้องรัน `npm run api` แยกอีกหน้าต่าง
function jsonServer(): Plugin {
  let child: ChildProcess | undefined;

  const start = async () => {
    // ถ้ามี JSON Server รันอยู่แล้ว (เช่นเปิด `npm run api` ไว้) ไม่ต้องเปิดซ้ำ
    try {
      await fetch(`${API_TARGET}/books`);
      return;
    } catch {
      // ยังไม่มี server ทำงาน
    }
    const bin = fileURLToPath(new URL('./node_modules/json-server/lib/bin.js', import.meta.url));
    child = spawn(process.execPath, [bin, '--host', API_HOST, '--port', String(API_PORT), 'db.json'], {
      cwd: fileURLToPath(new URL('.', import.meta.url)),
      stdio: 'inherit',
    });
    const stop = () => child?.kill();
    process.once('exit', stop);
    process.once('SIGINT', () => {
      stop();
      process.exit();
    });
  };

  return {
    name: 'json-server',
    configureServer: start,
    configurePreviewServer: start,
  };
}

// เว็บเรียก /api/... แล้ว Vite ส่งต่อไปที่ JSON Server (ตัด /api ออก)
const proxy = {
  '/api': {
    target: API_TARGET,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), jsonServer()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { proxy },
  preview: { proxy },
});
