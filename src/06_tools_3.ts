import OpenAI from "openai";
import type {
  ChatCompletionTool,
  ChatCompletionMessageParam,
} from "openai/resources.mjs";
import { trackDown, whack } from "./tools";
const client = new OpenAI({});

let chatHistory: ChatCompletionMessageParam[] = [
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

let tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "track_down",
      description: "Find the person",
      parameters: {
        type: "object",
        properties: {
          target: {
            type: "string",
            description: "The imaginary person to be found",
          },
        },
        required: ["target"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "whack",
      description:
        "Use it when you gotta... take care of business. You don’t ask, you don’t wait. You *do*",
      parameters: {
        type: "object",
        properties: {
          target: {
            type: "string",
            description: 'The imaginary person to be "whacked"',
          },
        },
        required: ["target"],
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
      case "track_down": {
        const result = trackDown({ target: args.target });
        return chatHistory.push({
          tool_call_id: tool_call.id,
          role: "tool",
          content: JSON.stringify(result),
        });
      }
      case "whack": {
        const result = whack({ target: args.target });
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
