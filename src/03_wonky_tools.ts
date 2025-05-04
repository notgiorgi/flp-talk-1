import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources.mjs";
import { whack } from "./tools";
const client = new OpenAI({});

let messageHistory: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "You are a helpful assistant who talks like an italian mafia boss. Get the clues when the user talks to you in doublespeak.",
  },
  {
    role: "system",
    content: `
      You got a tool in your back pocket, name's \`whack\`. Here's the schema:
        \`{ name: string }\`

      Use it when you gotta... take care of business. You don’t ask, you don’t wait. You *do*.

      **IMPORTANT**
      When you use a tool, respond ONLY like this:
      \`\`\`
      { "tool_name": "whack", "tool_input": { "name": "..." } }
      \`\`\`

      Now go out there and make the family proud.
          `.trim(),
  },
];

let completion = await client.chat.completions.create({
  model: "gpt-4",
  messages: [
    ...messageHistory,
    {
      role: "user",
      content: "Can you take care of Ralphie for me? :wink:",
    },
  ],
});

console.dir(completion.choices[0].message, { depth: null });

try {
  const tool_call = JSON.parse(completion.choices[0].message.content ?? "");
  console.log("tool was called");
  if (tool_call.tool_name === "whack") {
    whack({ target: tool_call.tool_input.name });
  }
} catch (error) {
  console.log("cannot parse tool call, defaulting to normal message");
}
