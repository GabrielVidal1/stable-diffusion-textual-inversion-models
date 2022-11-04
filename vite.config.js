import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/stable-diffusion-textual-inversion-models/',
  plugins: [react()]
})
