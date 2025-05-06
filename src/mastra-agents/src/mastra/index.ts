import { createLogger } from "@mastra/core/logger";
import { LibSQLStore } from "@mastra/libsql";
import { Mastra } from "@mastra/core";
import { movieAgent } from "./agents";

export const mastra = new Mastra({
  agents: { movieAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Quentin",
    level: "info",
  }),
});
