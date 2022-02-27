import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: 'window',
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
            define: { 'process.env.NODE_ENV': '"production"' }, // https://github.com/evanw/esbuild/issues/660
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  }
})
