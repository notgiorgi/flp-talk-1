import { optional, z } from "zod";
import { generateText, type CoreMessage, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { addToWatchlist, searchMovie } from "./tools";
import { SYSTEM_PROMPT } from "./misc";

let chatHistory: CoreMessage[] = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
  {
    role: "user",
    content:
      "Who is a director of Conclave (2024)? after you do that, maybe add it to my watchlist later",
  },
];

let { text, toolCalls, toolResults, steps } = await generateText({
  model: openai("gpt-4o"),
  messages: chatHistory,
  maxSteps: 4,
  tools: {
    searchMovie: tool({
      description:
        "Search for a movie by title and return information about it including director, year, and other details",
      parameters: z.object({
        title: z.string().describe("The title of the movie to search for"),
        year: z
          .string()
          .describe("The year released of the movie to search for")
          .optional(),
      }),
      execute: async (arg) => {
        return searchMovie({ title: arg.title });
      },
    }),
    addToWatchlist: tool({
      description: "Add a movie to the user's watchlist for later viewing",
      parameters: z.object({
        title: z
          .string()
          .describe("The title of the movie to add to the watchlist"),
        year: z.coerce
          .number()
          .describe("The year released of the movie to add to the watchlist"),
      }),
      execute: async ({ title, year }) => {
        return addToWatchlist({ title, year });
      },
    }),
  },
});

console.log(text);
console.log(toolCalls);
console.log("Iterations", steps.length);
