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
import {
  addToWatchlistTool,
  getWatchlistTool,
  searchMovieTool,
} from "./tools/mastra-tools";
import { SYSTEM_PROMPT } from "./misc";

export const movieAgent = new Agent({
  name: "Movie Agent",
  instructions: SYSTEM_PROMPT,
  model: openai("gpt-4o"),
  tools: {
    addToWatchlistTool,
    getWatchlistTool,
    searchMovieTool,
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

export const mastra = new Mastra({
  agents: { movieAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Tony",
    level: "info",
  }),
});
