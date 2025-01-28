import { z } from 'zod';

export const MBTIResultSchema = z.object({
  type: z.string(),
  name: z.string(),
  description: z.string(),
  detailedDescription: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  compatibleTypes: z.array(z.string()),
  careers: z.array(z.string()),
  scores: z.record(z.string(), z.number()),
  timestamp: z.string()
});

export type MBTIResult = z.infer<typeof MBTIResultSchema>; 