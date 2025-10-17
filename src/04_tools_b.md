### 0. Training

The LLM is trained on examples of tool calls, learning to recognize when to use tools and how to format the output.

### 1. Tool Descriptions as Context

The JSON schema tool definitions you provide are converted to text and injected into the LLM's context:

```typescript
{
  name: "search_movie",
  description: "Find a movie by title and year, returning relevant information",
  parameters: { /* JSON schema */ }
}
```

This becomes part of the prompt, essentially telling the LLM:
- What tools are available
- When to use each tool (via descriptions)
- What parameters to provide (via schema)

The LLM reads these descriptions like instructions in natural language.

### 2. Text Generation

When the LLM decides a tool is needed (based on the descriptions in context), it generates regular text output—just like any other response.

### 3. Special Formatting

That generated text is wrapped in a special XML-like tag structure:

```xml
<function_call>
  <name>search_movie</name>
  <parameters>
    {"title": "Conclave", "year": 2024}
  </parameters>
</function_call>
```

### 4. Provider Parsing

The model provider (OpenAI, Anthropic, etc.) intercepts this special format:

- Parses the structured output
- Converts it to a usable format (e.g., JSON)
- Returns it as `tool_calls` in the API response
- Your code can then execute the actual function

## Key Insight

**There is no "real" tool calling.** The LLM just learned to output text in a format that providers can parse and structure.
