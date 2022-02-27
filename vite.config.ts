import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

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
          buffer: true,
          define: { 'process.env.NODE_ENV': '"production"' }, // https://github.com/evanw/esbuild/issues/660
      }),
      ]
    }
  },
  build: {
    rollupOptions: {
        plugins: [
            // Enable rollup polyfills plugin
            // used during production bundling
            rollupNodePolyFill()
        ]
    }
}
})
