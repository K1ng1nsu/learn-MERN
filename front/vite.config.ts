import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    console.log(`현재 모드: ${mode}`);
    return {
        plugins: [react()],
    };
});
