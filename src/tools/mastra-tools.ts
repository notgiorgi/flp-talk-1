import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getWatchlist, addToWatchlist, searchMovie } from ".";

export const getWatchlistTool = createTool({
  id: "get-watchlist",
  description: "Get the current user's movie watchlist",
  inputSchema: z.object({}),
  outputSchema: z.object({
    ok: z.boolean(),
    code: z.number(),
    watchlist: z.array(z.any()),
  }),
  execute: () => {
    console.log(`Getting watchlist 📋`);
    const { watchlist } = getWatchlist();
    return Promise.resolve({
      ok: true,
      code: 200,
      watchlist,
    });
  },
});

export const addToWatchlistTool = createTool({
  id: "add-to-watchlist",
  description: "Add a movie to the user's watchlist for later viewing",
  inputSchema: z.object({
    title: z
      .string()
      .describe("The title of the movie to add to the watchlist"),
    year: z.coerce
      .number()
      .describe("The year released of the movie to add to the watchlist"),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    code: z.number(),
  }),
  execute: async ({ context: { title, year } }) => {
    return addToWatchlist({ title, year });
  },
});

export const searchMovieTool = createTool({
  id: "search-movie",
  description:
    "Search for a movie by title and return information about it including director, year, and other details",
  inputSchema: z.object({
    title: z.string().describe("The title of the movie to search for"),
    year: z.coerce
      .number()
      .describe("The year released of the movie to search for")
      .optional(),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    data: z.object({
      title: z.string(),
      year: z.number().optional(),
      director: z.string(),
      imdbScore: z.number(),
      watchlisted: z.boolean(),
    }),
  }),
  execute: async ({ context: { title, year } }) => {
    return searchMovie({ title, year });
  },
});
