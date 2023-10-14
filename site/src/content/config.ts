import { defineCollection, reference, z } from 'astro:content';

const categories = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: image(),
    requirements: z.array(reference('requirements')),
  }),
});

const conditions = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    requirements: z.array(reference('requirements')),
  }),
});

const requirements = defineCollection({
  type: 'data',
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