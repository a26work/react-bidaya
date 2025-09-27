import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'ReactBidaya',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'react-bidaya.es.js' : 'react-bidaya.umd.js'),
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@heroicons/react',
        'axios',
        'chart.js',
        'react-chartjs-2',
        'react-redux',
        'redux',
        '@reduxjs/toolkit',
        'clsx',
        'date-fns',
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          '@tanstack/react-query': 'TanstackReactQuery',
          '@heroicons/react': 'HeroiconsReact',
          'axios': 'Axios',
          'chart.js': 'Chart',
          'react-chartjs-2': 'ReactChartjs2',
          'react-redux': 'ReactRedux',
          'redux': 'Redux',
          '@reduxjs/toolkit': 'ReduxToolkit',
          'clsx': 'clsx',
          'date-fns': 'dateFns',
        },
      },
    },
    emptyOutDir: true,
    target: 'es2018',
    minify: 'esbuild',
  },
})