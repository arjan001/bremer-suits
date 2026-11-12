import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import contentCollections from '@content-collections/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Expose Supabase credentials to both the client bundle (VITE_*) and the
  // Netlify Functions runtime (process.env) when running functions locally.
  const supabaseUrl = env.VITE_SUPABASE_URL ?? env.SUPABASE_URL ?? ''
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? ''
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  process.env.SUPABASE_URL = supabaseUrl
  process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey

  return {
    plugins: [
      contentCollections(),
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      // Edge functions (visitor tracking) require Deno, which isn't available
      // in local dev — disable them here; they still run on Netlify deploys.
      netlify({ dev: { edgeFunctions: { enabled: false } } }),
      tanstackStart(),
      viteReact(),
    ],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    server: {
      port: 3000,
      preview: {
        allowedHosts: ['www.bremersuits.com', 'bremersuits.com', 'localhost', '127.0.0.1'],
      },
    },
  }
})
