// https://ai-sdk.dev/docs/ai-sdk-core
import { z } from "zod";
import { generateText, type CoreMessage, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT } from "./misc";

let chatHistory: CoreMessage[] = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
  {
    role: "user",
    content:
      "Who is a director of Conclave (2024)? also, please add it to my watchlist",
  },
];

const [response1, response2, response3] = await Promise.all([
  generateText({
    model: openai("gpt-4o"),
    messages: chatHistory,
  }),
  generateText({
    model: anthropic("claude-3-5-sonnet-latest"),
    messages: chatHistory,
  }),
  // Gen structured data
  generateObject({
    model: openai("gpt-4-turbo"),
    schema: z.object({
      characters: z.array(
        z.object({
          name: z.string(),
          catchphrase: z.string(),
        }),
      ),
    }),
    prompt: "List 3 main characters and their catchphrases from GoodFellas",
  }),
]);

console.log("\x1b[36mGPT-4o:\x1b[0m", response1.text);
console.log("\x1b[35mClaude:\x1b[0m", response2.text);
console.log("\n\n\x1b[33mGenerateObject\x1b[0m", response3.object);
