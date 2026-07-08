import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getDb } from "../database/mongodb";

export const checkRoomAvailabilityTool = createTool({
  id: "check-room-availability",
  description: "Check if a room is available in a given time range",
  inputSchema: z.object({
    roomId: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  }),
  outputSchema: z.object({
    available: z.boolean(),
  }),
  execute: async (context) => {
    const db = await getDb();
    const conflict = await db.collection("bookings").findOne({
      roomId: context.roomId,
      status: "confirmed",
      startTime: { $lt: new Date(context.endTime) },
      endTime: { $gt: new Date(context.startTime) },
    });

    return { available: !conflict };
  },
});
