import { z } from "zod";

export const bookingStatusSchema = z.enum(["confirmed", "cancelled"]);

export const bookingSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  roomName: z.string(),
  title: z.string(),
  organizer: z.string(),
  startTime: z.string().describe("ISO 8601 timestamp"),
  endTime: z.string().describe("ISO 8601 timestamp"),
  attendees: z.number().int().positive(),
  status: bookingStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;
