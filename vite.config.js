// 재배포 트리거용 사소한 변경 (VITE_AIRKOREA_SERVICE_KEY 환경변수 반영 확인)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
});
