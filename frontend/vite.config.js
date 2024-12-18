import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  host: true, // Expose server to all network interfaces
  port: 5173, // Optional: Set the port if you want to use a specific one
  // vite config
 
})
