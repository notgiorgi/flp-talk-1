import { z } from "zod";
import { generateText, type CoreMessage, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { trackDown, whack } from "./tools";

let chatHistory: CoreMessage[] = [
  {
    role: "system",
    content:
      "You are a helpful assistant who talks like an italian mafia boss. Get the clues when the user talks to you in doublespeak.",
  },
  {
    role: "user",
    content: "Can find and take care of Ralphie for me? :wink:",
  },
];

let { text, toolCalls, toolResults, steps } = await generateText({
  model: openai("gpt-4o"),
  messages: chatHistory,
  maxSteps: 1,
  tools: {
    eatSandwich: tool({
      description:
        "Whenever you feel like you accomplished something, just take a break and eat a sandwich",
      parameters: z.object({
        type: z
          .enum(["gabagool", "bologna"])
          .describe("The type of sandwich to eat"),
      }),
      execute: async (arg) => {
        console.log(`Eating ${arg.type} sandwich`);
      },
    }),
    whack: tool({
      description:
        "Use it when you gotta... take care of business. You don’t ask, you don’t wait. You *do*",
      parameters: z.object({
        target: z.string().describe('The imaginary person to be "whacked"'),
      }),
      execute: async (arg) => {
        return whack(arg);
      },
    }),
    trackDown: tool({
      description: "Track down the person and return location",
      parameters: z.object({
        target: z.string().describe("The imaginary person to be found"),
      }),
      execute: async (arg) => {
        return trackDown(arg);
      },
    }),
  },
});

console.log(text);
