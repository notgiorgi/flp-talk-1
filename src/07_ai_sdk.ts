// https://ai-sdk.dev/docs/ai-sdk-core
import { z } from "zod";
import { generateText, type CoreMessage, generateObject } from "ai";
import { openai, createOpenAI } from "@ai-sdk/openai";
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
      "Who is a director of Goodfellas (1990)? also, please add it to my watchlist",
  },
];

const ailab = createOpenAI({
  name: "ailab.ge",
  apiKey: process.env.AILAB_API_KEY,
  baseURL: process.env.AILAB_BASE_URL,
});

const [response1, response2, response3, response4] = await Promise.all([
  generateText({
    model: openai("gpt-4o"),
    messages: chatHistory,
  }),
  generateText({
    model: anthropic("claude-3-5-sonnet-latest"),
    messages: chatHistory,
  }),
  generateText({
    model: ailab("kona-2.0"),
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
console.log("\n\n\x1b[33mAILab.ge\x1b[0m", response3.text);
console.log("\n\n\x1b[33mGenerateObject\x1b[0m", response4.object);
