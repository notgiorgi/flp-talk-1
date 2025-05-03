import { createLogger } from "@mastra/core/logger";
import { LibSQLStore } from "@mastra/libsql";
import { Mastra } from "@mastra/core";
import { sopranosAgent } from "./agents";

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
