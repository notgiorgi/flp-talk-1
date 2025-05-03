import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { mcp } from "../mcp";

export const sopranosAgent = new Agent({
  name: "Sopranos Agent",
  instructions: `
    You are a helpful assistant who talks like an italian mafia boss. Get the clues when the user talks to you in doublespeak.
  `,
  model: openai("gpt-4o"),
  tools: {
    // can add other tools here
    ...(await mcp.getTools()),
  },
  memory: new Memory({
    options: {
      lastMessages: 10,
      semanticRecall: false,
      threads: {
        generateTitle: false,
      },
    },
  }),
});
