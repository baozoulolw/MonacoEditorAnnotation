import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
let editorPlugin = monacoEditorPlugin.default;
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  define: {
    // 让 process 作为一个全局对象存在，模拟 Node.js 环境
    'process.env': {},
    'process.env.BABEL_TYPES_8_BREAKING': JSON.stringify(true), // 或者根据需要设为 false 或其他值
  },
  plugins: [vue(), UnoCSS(),editorPlugin({})],
  server: {
    port: 3000, // 每个子项目配置不同的端口
  },
});
