// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
var blog = defineCollection({
  name: "blog",
  directory: "content/blog",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    author: z.string(),
    content: z.string()
  })
});
var content_collections_default = defineConfig({
  collections: [blog]
});
export {
  content_collections_default as default
};
