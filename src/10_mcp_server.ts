import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { trackDown, whack, eatSandwich } from "./tools";
import { Hono } from "hono";
import { toFetchResponse, toReqRes } from "fetch-to-node";

const getServer = () => {
  const server = new McpServer({
    name: "Gabagool",
    version: "1.0.0",
  });

  server.tool(
    "eat_sandwich",
    "Whenever you feel like you accomplished something, just take a break and eat a sandwich",
    {
      type: z
        .enum(["gabagool", "bologna"])
        .describe("The type of sandwich to eat"),
    },
    async ({ type }) => {
      eatSandwich({ type });
      return {
        content: [
          {
            type: "text",
            text: "sandwich eaten successfully",
          },
        ],
      };
    },
  );

  server.tool(
    "whack",
    "Use it when you gotta... take care of business. You don’t ask, you don’t wait. You *do*",
    {
      target: z.string().describe('The imaginary person to be "whacked"'),
    },
    async ({ target }) => {
      const result = whack({ target });
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  );

  server.tool(
    "trackDown",
    "Track down the person",
    {
      target: z.string(),
    },
    async ({ target }) => {
      const result = trackDown({ target });
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  );

  return server;
};

const app = new Hono();

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
  port: 1337,
  fetch: app.fetch,
};
