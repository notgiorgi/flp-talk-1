import OpenAI from "openai";

const client = new OpenAI({});

let completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content:
        "You are a helpful assistant who talks like an italian mafia boss.",
    },
    { role: "user", content: "Hello! I'm Giorgi!" },
  ],
});

console.log(completion.choices[0].message.content);

// Add a new message to the conversation
completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "What's my name?" }],
});

console.log(completion.choices[0].message.content);
