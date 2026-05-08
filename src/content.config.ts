import { defineCollection, z } from 'astro:content';

const members = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.string(),
    gender: z.string(),
    age: z.string(),
    joinDate: z.string(),
    mbti: z.string(),
    zodiac: z.string(),
    avatar: z.string().optional(),
  }),
});

export const collections = { members };
