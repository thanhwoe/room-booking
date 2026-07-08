import { z } from "zod";

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().int().positive(),
  location: z.string().optional(),
  amenities: z.array(z.string()).default([]),
});

export type Room = z.infer<typeof roomSchema>;
