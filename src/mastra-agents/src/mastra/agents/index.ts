import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import {
  addToWatchlistTool,
  getWatchlistTool,
  searchMovieTool,
} from "../tools";

export const movieAgent = new Agent({
  name: "Movie Agent",
  instructions: `You are a helpful assistant and a movie Geek. You help users with their movie-related questions and manage their movie journal: watch history, watchlist, reviews, ratings.`,
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
