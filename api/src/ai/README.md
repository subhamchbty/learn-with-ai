# LangChain Integration

This directory contains the LangChain integration for AI content generation.

## Architecture

The AI functionality is now separated into distinct layers:

### 1. **LangChain Provider** (`providers/langchain.provider.ts`)
- Encapsulates all LangChain-specific logic
- Handles prompt templates, chains, and structured output parsing
- Uses Zod schemas for type-safe output validation
- Configures the Groq AI model (Llama)

### 2. **AI Service** (`ai.service.ts`)
- Business logic layer
- Orchestrates AI generation with database operations
- Uses the LangChain provider for all AI operations
- Handles error handling and retries

### 3. **AI Controller** (`ai.controller.ts`)
- HTTP endpoint handlers
- Request validation via DTOs
- Routes requests to AI Service

## Benefits of LangChain

1. **Framework Agnostic**: Easy to swap out LLM providers (OpenAI, Anthropic, etc.)
2. **Structured Outputs**: Type-safe responses using Zod schemas
3. **Prompt Templates**: Reusable and maintainable prompt engineering
4. **Chains**: Composable AI operations for complex workflows
5. **Memory**: Built-in support for conversation history (for future features)
6. **Tools**: Easy integration with external tools and APIs

## Usage

### Generating Topics

```typescript
const result = await langChainProvider.generateTopics(
  'JavaScript',
  'Intermediate'
);
// Returns: { topics: string[] }
```

### Generating Study Plans

```typescript
const result = await langChainProvider.generatePlan(
  'JavaScript',
  'Intermediate',
  ['Closures', 'Promises', 'Async/Await']
);
// Returns: { title, description, schedule }
```

## Extending the Provider

To add new AI features:

1. Define a Zod schema for the expected output
2. Create a prompt template
3. Build a chain: `promptTemplate.pipe(model).pipe(parser)`
4. Add a method to `LangChainProvider`

### Example: Adding Course Generation

```typescript
async generateCourse(topic: string): Promise<Course> {
  const courseSchema = z.object({
    title: z.string(),
    modules: z.array(z.object({
      name: z.string(),
      content: z.string(),
    })),
  });

  const parser = StructuredOutputParser.fromZodSchema(courseSchema);
  const promptTemplate = PromptTemplate.fromTemplate(
    `Create a detailed course about {topic}.\n{format_instructions}`
  );

  const chain = promptTemplate.pipe(this.model).pipe(parser);
  
  return await chain.invoke({
    topic,
    format_instructions: parser.getFormatInstructions(),
  });
}
```

## Configuration

The provider is configured via environment variables:

- `GROQ_API_KEY`: Groq API key

## Dependencies

```json
{
  "@langchain/core": "^x.x.x",
  "@langchain/groq": "^x.x.x",
  "langchain": "^x.x.x",
  "zod": "^x.x.x"
}
```

## Switching LLM Providers

To use a different LLM (e.g., OpenAI):

1. Install the provider: `npm install @langchain/openai`
2. Update the import and model initialization in `langchain.provider.ts`:

```typescript
import { ChatOpenAI } from '@langchain/openai';

this.model = new ChatOpenAI({
  apiKey: this.configService.get('OPENAI_API_KEY'),
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
});
```

The rest of the code remains unchanged due to LangChain's abstraction!
