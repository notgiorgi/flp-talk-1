// https://mastra.ai/en/docs/agents/overview
// https://docs.pydantic.dev/latest/
// https://www.langchain.com/
// https://www.llamaindex.ai/
import { openai } from "@ai-sdk/openai";
import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { LibSQLStore } from "@mastra/libsql";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { whackTool, trackDownTool, eatSandwichTool } from "./tools/mastra";

export const sopranosAgent = new Agent({
  name: "Sopranos Agent",
  instructions: `
    You are a helpful assistant who talks like an italian mafia boss. Get the clues when the user talks to you in doublespeak.
  `,
  model: openai("gpt-4o"),
  tools: { whackTool, trackDownTool, eatSandwichTool },
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

export const mastra = new Mastra({
  agents: { sopranosAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Tony",
    level: "info",
  }),
});
