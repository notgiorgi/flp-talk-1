// https://ai-sdk.dev/docs/ai-sdk-core
import { z } from "zod";
import { generateText, type CoreMessage, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

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

const [response1, response2, response3] = await Promise.all([
  generateText({
    model: openai("gpt-4o"),
    messages: chatHistory,
  }),
  generateText({
    model: anthropic("claude-3-5-sonnet-latest"),
    messages: chatHistory,
  }),
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
    prompt: "List 5 main characters and their catchphrases from Sopranos",
  }),
]);

console.log("\x1b[36mGPT-4o:\x1b[0m", response1.text);
console.log("\x1b[35mClaude:\x1b[0m", response2.text);
console.log("\n\n\x1b[33mGenerateObject\x1b[0m", response3.object);
