import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: "./src/content/categories" }),
  schema: ({ image }) => z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: image(),
    requirements: z.array(reference('requirements')),
  }),
});

const conditions = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: "./src/content/conditions" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    requirements: z.array(reference('requirements')),
  }),
});

const requirements = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: "./src/content/requirements" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: reference('categories'),
    conditions: z.array(reference('conditions')),
  }),
});

export const collections = {
  categories,
  conditions,
  requirements,
};