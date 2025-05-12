import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { addToWatchlist, searchMovie, getWatchlist } from "./tools";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { toFetchResponse, toReqRes } from "fetch-to-node";

const getServer = () => {
  const server = new McpServer({
    name: "Rotten Tomatoes",
    version: "1.0.0",
    instructions: "Rotten tomatoes audience rating checker",
  });

  server.tool(
    "check_audience_rating",
    "Checks the audience_rating of a movie",
    {
      title: z.string().describe("The title of the movie"),
      year: z.coerce.number().describe("The year released of the movie"),
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              rating: Math.round(Math.random() * 5 + 5),
            }),
          },
        ],
      };
    },
  );

  return server;
};

const app = new Hono();
app.use(logger());

app.post("/mcp", async (c) => {
  const { req, res } = toReqRes(c.req.raw);
  const server = getServer();
  try {
    const transport: StreamableHTTPServerTransport =
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
    await server.connect(transport);
    await transport.handleRequest(req, res, await c.req.json());
    res.on("close", () => {
      console.log("Request closed");
      transport.close();
      server.close();
    });
    return toFetchResponse(res);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      },
      500,
    );
  }
});

export default {
  port: parseInt(Bun.env.PORT ?? "7890"),
  fetch: app.fetch,
};
