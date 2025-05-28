import { createLogger } from "@mastra/core/logger";
import { DefaultStorage } from "@mastra/libsql";
import { Mastra } from "@mastra/core";
import { movieAgent } from "./agents";

const storage = new DefaultStorage({
  url: ":memory:",
});

export const mastra = new Mastra({
  agents: { movieAgent },
  storage,
  logger: createLogger({
    name: "Quentin",
    level: "info",
  }),
});
