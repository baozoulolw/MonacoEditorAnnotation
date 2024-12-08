import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [dts()],
  define: {
    // 让 process 作为一个全局对象存在，模拟 Node.js 环境
    "process.env": {},
    "process.env.BABEL_TYPES_8_BREAKING": JSON.stringify(true), // 或者根据需要设为 false 或其他值
  },
  build: {
    outDir: "dist",
    lib: {
      entry: "./src/index.ts", // 工具库入口
      name: "Utils", // 工具库名称
      fileName: (format: string) => `index.${format}.js`,
    },
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
      },
    },
  },
});
