import { z } from "zod";

export const bookingSchema = z.object({
  organizer: z.string(),
  status: z.enum(["confirmed", "cancelled", "all"]).optional(),
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
});
