# LangChain Migration Guide

This document describes the changes made to integrate LangChain framework into the Learn with AI API for AI content generation.

## What Changed

### 1. New Dependencies

Added LangChain packages to `package.json`:
- `@langchain/core` - Core LangChain functionality
- `@langchain/google-genai` - Google Generative AI integration for LangChain
- `langchain` - Main LangChain library
- `zod` - Schema validation (already included)

### 2. New File Structure

```
api/src/ai/
├── providers/
│   └── langchain.provider.ts   # NEW: Encapsulates all LangChain logic
├── ai.controller.ts
├── ai.module.ts                # MODIFIED: Added LangChainProvider
├── ai.service.ts               # MODIFIED: Now uses LangChainProvider
├── dto/
│   └── ai.dto.ts               # MODIFIED: Added validation decorators
├── interfaces/
│   └── ai.interfaces.ts
└── README.md                   # NEW: Documentation
```

### 3. Code Changes

#### `ai.dto.ts`
- Added validation decorators (`@IsString()`, `@IsArray()`, etc.)
- This fixes the null constraint error by ensuring properties aren't stripped by ValidationPipe

#### `langchain.provider.ts` (NEW)
- Separated AI logic into a dedicated provider
- Uses LangChain's `PromptTemplate` for maintainable prompts
- Uses `StructuredOutputParser` with Zod schemas for type-safe outputs
- Handles all Gemini API interactions

#### `ai.service.ts`
- Simplified from ~166 lines to ~54 lines
- Removed direct Google GenAI SDK usage
- Now delegates to `LangChainProvider`
- Focuses on business logic (saving to database, error handling)

#### `ai.module.ts`
- Added `LangChainProvider` to the providers array

## Benefits

### 1. **Separation of Concerns**
- **LangChainProvider**: AI/LLM interactions
- **AiService**: Business logic & orchestration
- **AiController**: HTTP routing & validation

### 2. **Type Safety**
Zod schemas ensure:
- Runtime validation of AI responses
- TypeScript type inference
- Clear documentation of expected outputs

### 3. **Maintainability**
- Prompts are now templates, not string concatenation
- Easy to test individual components
- Clear abstraction boundaries

### 4. **Flexibility**
- Easy to switch LLM providers (OpenAI, Anthropic, etc.)
- Can add memory, tools, and agents later
- Reusable prompt templates

### 5. **Better Error Handling**
- Structured parsing catches malformed AI responses
- Type validation at runtime
- Clear error messages

## How to Use

### Basic Usage (No Changes Needed)

The API endpoints remain unchanged:
```typescript
POST /api/ai/generate-topics
POST /api/ai/generate-plan
```

### Extending with New Features

To add a new AI generation feature:

```typescript
// 1. Define schema in langchain.provider.ts
const schema = z.object({
  field1: z.string(),
  field2: z.array(z.string()),
});

// 2. Create parser
const parser = StructuredOutputParser.fromZodSchema(schema);

// 3. Create prompt template
const promptTemplate = PromptTemplate.fromTemplate(
  `Your prompt here: {variable}\n{format_instructions}`
);

// 4. Build chain
const chain = promptTemplate.pipe(this.model).pipe(parser);

// 5. Invoke
const result = await chain.invoke({
  variable: value,
  format_instructions: parser.getFormatInstructions(),
});
```

## Switching LLM Providers

To use OpenAI instead of Google Gemini:

```typescript
// In langchain.provider.ts
import { ChatOpenAI } from '@langchain/openai';

this.model = new ChatOpenAI({
  apiKey: this.configService.get('OPENAI_API_KEY'),
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
});
```

No other code changes needed!

## Testing

The changes are backward compatible. All existing tests should pass without modification.

## Rollback

If needed, you can rollback by:
1. Reverting `ai.service.ts` to use Google GenAI directly
2. Removing `langchain.provider.ts`
3. Updating `ai.module.ts` to remove `LangChainProvider`
4. Uninstalling LangChain packages

However, we recommend keeping the changes due to the significant benefits in maintainability and flexibility.

## Next Steps

Consider adding:
1. **Conversation Memory**: For multi-turn conversations
2. **RAG (Retrieval Augmented Generation)**: For knowledge base integration
3. **Agents**: For complex, multi-step AI workflows
4. **Streaming**: For real-time token-by-token responses
5. **Caching**: To reduce API costs and improve performance

All of these are built into LangChain and can be added incrementally!
