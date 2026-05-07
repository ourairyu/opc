import { defineCollection, z } from 'astro:content';

const members = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.string(),
    agentId: z.string(),
    timezone: z.string(),
    personality: z.string(),
    appearance: z.string(),
  }),
});

export const collections = { members };
