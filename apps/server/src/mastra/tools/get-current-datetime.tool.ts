import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const getCurrentDatetimeTool = createTool({
  id: "get-current-datetime",
  description:
    "Get the current date and time. Use this to resolve relative date/time expressions from the user (e.g. 'today', 'tomorrow', 'next Monday', 'in 2 hours'), or whenever you need to double-check the exact current time — especially in long conversations where real time may have passed since the start. Optionally pass a timezone to also get a human-readable version in that timezone.",
  inputSchema: z.object({
    timezone: z
      .string()
      .optional()
      .describe(
        "IANA timezone name, e.g. 'Asia/Ho_Chi_Minh', 'America/New_York'. Defaults to UTC if omitted or invalid.",
      ),
  }),
  outputSchema: z.object({
    isoUtc: z.string().describe("Current date/time in ISO 8601 UTC format"),
    unixTimestampMs: z
      .number()
      .describe("Current time as Unix timestamp in milliseconds"),
    dayOfWeek: z
      .string()
      .describe("Day of the week in the resolved timezone, e.g. 'Thursday'"),
    timezoneUsed: z
      .string()
      .describe("The timezone actually used (falls back to UTC if invalid)"),
    humanReadable: z
      .string()
      .describe("Human-readable current date/time in timezoneUsed"),
  }),
  execute: async (inputData) => {
    const now = new Date();
    const requestedTimezone = inputData.timezone;

    const formatOpts: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    };

    let timezoneUsed = "UTC";
    let humanReadable: string;

    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        ...formatOpts,
        timeZone: requestedTimezone || "UTC",
      });
      humanReadable = formatter.format(now);
      timezoneUsed = requestedTimezone || "UTC";
    } catch {
      humanReadable = new Intl.DateTimeFormat("en-US", {
        ...formatOpts,
        timeZone: "UTC",
      }).format(now);
      timezoneUsed = "UTC";
    }

    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneUsed,
      weekday: "long",
    }).format(now);

    return {
      isoUtc: now.toISOString(),
      unixTimestampMs: now.getTime(),
      dayOfWeek,
      timezoneUsed,
      humanReadable,
    };
  },
});
