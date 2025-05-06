import { MCPClient } from "@mastra/mcp";

export const mcp = new MCPClient({
  servers: {
    rotten_tomatoes: {
      url: new URL("http://localhost:7890/mcp"),
    },
  },
});
