import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const blog = defineCollection({
  name: 'blog',
  directory: 'content/blog',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    category: z.string().optional().default('General'),
    author: z.string(),
    content: z.string(),
  }),
})

export default defineConfig({
  collections: [blog],
})
