# PropertyBase — Common Base Fields

All Property types share the following base fields:

```typescript
interface PropertyBase {
  /** Required. Unique identifier for the parameter, used for data access. */
  name: string

  /** Optional. Label name displayed in the form. */
  display_name?: I18nText

  /** Optional. Whether the parameter is required. Default: false. */
  required?: boolean

  /** Optional. Conditional show/hide rules. */
  display?: {
    show?: DisplayCondition // Show when condition is true
    hide?: DisplayCondition // Hide when condition is true
  }

  /** Optional. AI-related configuration. */
  ai?: {
    /** Parameter description for LLM, helping AI understand parameter purpose. */
    llm_description?: I18nText
  }

  /** Optional. UI component configuration. Different types support different UI components. */
  ui?: PropertyUI
}
```

**Field Description**:

| Field          | Required | Description                                                                         |
| -------------- | -------- | ----------------------------------------------------------------------------------- |
| `name`         | ✅       | Parameter path identifier. Only alphanumeric and underscore.                        |
| `display_name` | ❌       | Form label. Uses humanized `name` if not provided.                                  |
| `required`     | ❌       | Mark as required; form will show required indicator.                                |
| `display`      | ❌       | Conditional visibility. See [Section 9](./declarative-parameters-display-condition.md). |
| `ai`           | ❌       | Parameter description when AI Agent calls tool.                                     |
| `ui`           | ❌       | Uses type's default UI component if not provided.                                   |

