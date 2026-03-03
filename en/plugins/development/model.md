# Developing Models

This guide will introduce you to developing and adding a new model (Model) in your plugin. A model definition describes the basic properties, capabilities, pricing, and parameter configuration of an LLM.

## Prerequisites

Before you begin, please ensure that you have:

1. Initialized your plugin project.
2. Installed the `@choiceopen/atomemo-plugin-sdk-js` dependency.

## 1. File Structure

It's recommended to place model definition files in the `src/models` directory for better organization.

```text
src/
  models/
    my-model.ts    # Model definition file
  index.ts         # Plugin entry point
```

## 2. Implement Model Definition

You need to create an object that implements the `ModelDefinition` interface. This interface defines all metadata for your model.

Here's a complete example implementing OpenAI GPT-4:

```typescript
import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const openaiGpt4 = {
  // Unique identifier for the model
  // Recommended format: "provider/model_name", e.g., "openai/gpt-4"
  // Rules: Only English letters, numbers, underscores, hyphens, and slashes allowed. Length: 4-64
  name: "openai/gpt-4",

  // Short description of the model (supports multi-language)
  description: { en_US: "OpenAI's GPT-4 language model" },

  // Display name (supports multi-language)
  display_name: { en_US: "GPT-4" },

  // Model icon, supports Emoji or image URL
  icon: "🔷",

  // Model type, currently fixed as "llm"
  model_type: "llm",

  // Supported input types: text (text), image (image), file (file)
  input_modalities: ["text", "image"],

  // Supported output types
  output_modalities: ["text"],

  // Parameter override configuration
  // Customize default parameters, max and min values for the model
  override_parameters: {
    temperature: {
      default: 1.0,
      maximum: 2.0,
      minimum: 0.0,
    },
  },

  // Pricing configuration (optional)
  // For estimating the cost of model calls
  pricing: {
    currency: "USD", // Currency unit
    input: 0.03, // Price per 1K input tokens
    output: 0.06, // Price per 1K output tokens
  },

  // List of unsupported parameters
  // Parameters listed here won't be displayed in the UI configuration panel
  unsupported_parameters: ["seed", "verbosity"],
} satisfies ModelDefinition
```

### Key Fields Explained

- **name**: Must be unique. The plugin system uses this name to identify models.
- **input_modalities**: Defines content types the model can handle. Include `"image"` if the model supports vision capabilities.
- **pricing**: If not provided, the model is considered free. All prices are typically based on tokens or requests.
- **unsupported_parameters**: Atomemo provides a set of common LLM parameters (such as `temperature`, `stream`, etc.). Declare here any parameters your model doesn't support.

## 3. Register the Model

After defining your model, you need to register it in your plugin's main entry file (usually `src/index.ts`).

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { openaiGpt4 } from "./models/openai-gpt4"

// ... Initialize plugin
const plugin = await createPlugin({
  // ...
})

// Register model
plugin.addModel(openaiGpt4)

// Run plugin
plugin.run()
```

## Reference

- **Type Definition**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) for `ModelDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/blob/main/src/schemas/README.md) for `ModelDefinitionSchema`
