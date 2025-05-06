import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources.mjs";
import { searchMovie, whack } from "./tools";
import { SYSTEM_PROMPT } from "./misc";
const client = new OpenAI({});

let messageHistory: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
  {
    role: "system",
    content: `
      You have a tool to search a movie by name and year (optional).

      Use it when you have to, you don’t ask, you don’t wait. You *do*.

      **IMPORTANT**
      When you use a tool, respond ONLY like this:
      \`\`\`
      { "tool_name": "search_movie", "tool_input": { "name": "...", "year": "..." } }
      \`\`\`
    `.trim(),
  },
];

let completion = await client.chat.completions.create({
  model: "gpt-4",
  messages: [
    ...messageHistory,
    {
      role: "user",
      content: "Who is a director of GoodFellas (1990)?",
    },
  ],
});

console.dir(completion.choices[0].message, { depth: null });

try {
  const tool_call = JSON.parse(completion.choices[0].message.content ?? "");
  console.log("tool was called");
  if (tool_call.tool_name === "search_movie") {
    searchMovie({
      title: tool_call.tool_input.title, // BUG check the prompt
      year: tool_call.tool_input.year,
    });
  }
} catch (error) {
  console.log("cannot parse tool call, defaulting to normal message");
}
