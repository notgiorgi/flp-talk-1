import OpenAI from "openai";
import type {
  ChatCompletionTool,
  ChatCompletionMessageParam,
} from "openai/resources.mjs";
import { searchMovie, addToWatchlist } from "./tools";
import { SYSTEM_PROMPT } from "./misc";
const client = new OpenAI({});

let chatHistory: ChatCompletionMessageParam[] = [
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

const reply = completion.choices[0].message;
if (reply.tool_calls) {
  chatHistory.push({
    role: "assistant",
    content: null,
    tool_calls: reply.tool_calls,
  });

  reply.tool_calls.forEach((tool_call) => {
    const args: { target: string } = JSON.parse(tool_call.function.arguments);

    switch (tool_call.function.name) {
      case "search_movie": {
        const parsedArgs = JSON.parse(tool_call.function.arguments);
        const result = searchMovie({
          title: parsedArgs.title,
          year: parsedArgs.year,
        });
        return chatHistory.push({
          tool_call_id: tool_call.id,
          role: "tool",
          content: JSON.stringify(result),
        });
      }
      case "add_to_watchlist": {
        const parsedArgs = JSON.parse(tool_call.function.arguments);
        const result = addToWatchlist({
          title: parsedArgs.title,
          year: parsedArgs.year,
        });
        return chatHistory.push({
          tool_call_id: tool_call.id,
          role: "tool",
          content: JSON.stringify(result),
        });
      }
    }
  });
}

completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: chatHistory,
  tools,
});

console.dir(completion.choices[0].message, { depth: null });
