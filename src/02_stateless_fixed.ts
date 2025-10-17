import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./misc";
const client = new OpenAI({});

let completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    { role: "user", content: "Hello! I'm Giorgi!" },
  ],
});
console.log(">", completion.choices[0].message.content);

// Add a new message to the conversation
completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    { role: "user", content: "Hello! I'm Giorgi!" },
    { role: "assistant", content: completion.choices[0].message.content },
    { role: "user", content: "What's my name?" },
  ],
});
console.log(">", completion.choices[0].message.content);
