import OpenAI from "openai";
import type {
  ChatCompletionTool,
  ChatCompletionMessageParam,
} from "openai/resources.mjs";
import { SYSTEM_PROMPT } from "./misc";
const client = new OpenAI({});

let chatHistory: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
  {
    role: "user",
    content: "Who is a director of Conclave (2024)?",
  },
];

let tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_movie",
      description:
        "Find a movie by title and year, returning relevant information",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the movie",
          },
          year: {
            type: "number",
            description: "The year the movie was released",
          },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_to_watchlist",
      description: "Add a movie to the users watchlist",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the movie",
          },
          year: {
            type: "number",
            description: "The year the movie was released",
          },
        },
        required: ["title", "year"],
      },
    },
  },
];

let completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: chatHistory,
  tools,
});

console.dir(completion.choices[0].message, { depth: null });
