import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    hmr: true,
    port: 3001,
    proxy: {
      '/api': {
        // target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_TARGET, // 目标代理接口地址
        target: "http://124.70.216.64:8081/",
        secure: false,
        changeOrigin: true, // 开启代理 在本地创建一个虚拟服务器
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
