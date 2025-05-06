import OpenAI from "openai";

const client = new OpenAI({});

let completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: `You are a helpful assistant and a movie Geek. You help users with their movie-related questions and manage their movie journal: watch history, watchlist, reviews, ratings.`,
    },
    { role: "user", content: "Hello! I'm Giorgi!" },
  ],
});

console.log(completion.choices[0].message.content);
