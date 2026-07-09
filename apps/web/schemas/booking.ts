import { z } from "zod";

export const bookingSchema = z.object({
  organizer: z.string(),
  status: z.enum(["confirmed", "cancelled", "all"]).optional(),
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
});

export const bookingConfirmSchema = z.object({
  action: z.enum(["create", "update", "cancel"]),
  roomName: z.string().optional(),
  title: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  attendees: z.number().optional(),
  bookingId: z.string().optional(),
});
