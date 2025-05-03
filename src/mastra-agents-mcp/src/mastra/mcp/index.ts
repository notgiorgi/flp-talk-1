import { MCPClient } from "@mastra/mcp";

export const mcp = new MCPClient({
  servers: {
    gabagool: {
      url: new URL("http://localhost:1337/mcp"),
    },
  },
});
