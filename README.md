# vibehack-talk

Requirements:
- Node.js v18+
- Bun.js v1+
- OpenAI key

To install dependencies:

```bash
bun install
```

Create .env.local and add keys to it
```
OPENAI_API_KEY=your_openai_api_key_here

# Optional, only used in example 7
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

To run:

```bash
bun run src/<EXAMPLE_NAME>.ts
```


To run agent demo:

```bash
cd src/mastra-agents
npm i
npm run dev
```


To run mcp inspector:

```bash
# run mcp example first, then

npx @modelcontextprotocol/inspector
```
