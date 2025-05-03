import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const trackDownTool = createTool({
  id: "track_down",
  description: "Track down a specified target",
  inputSchema: z.object({
    target: z.string().describe("Name or identifier of the target to track"),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    code: z.number(),
  }),
  execute: async ({ context }) => {
    console.log(`Tracking down ${context.target}! 🕵️‍♂️`);
    return {
      ok: true,
      code: 200,
    };
  },
});

export const whackTool = createTool({
  id: "whack",
  description:
    "Use it when you gotta... take care of business. You don’t ask, you don’t wait. You *do*",
  inputSchema: z.object({
    target: z.string().describe("Name or identifier of the target to whack"),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    code: z.number(),
  }),
  execute: async ({ context }) => {
    console.log(`Whacking ${context.target}! 🔫💥`);
    return {
      ok: true,
      code: 200,
    };
  },
});

export const eatSandwichTool = createTool({
  id: "eat-sandwich",
  description:
    "Whenever you feel like you accomplished something, just take a break and eat a sandwich",
  inputSchema: z.object({
    type: z.enum(["gabagool", "bologna"]).describe("Type of sandwich to eat"),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    console.log(`Eating ${context.type} sandwich`);
    return {
      ok: true,
      message: `Enjoyed a delicious ${context.type} sandwich 🥪`,
    };
  },
});
