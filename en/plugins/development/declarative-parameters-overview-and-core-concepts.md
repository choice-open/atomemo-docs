# Overview and Core Concepts

The Atomemo plugin system uses a **declarative** approach to define tool parameters. You only need to write a JSON/TypeScript configuration object, and the system will automatically render the corresponding form UI.

```
Tool Definition
-- parameters: Property[]
    -- Property
        |-- name (identifier)
        |-- type (data type)
        |-- display_name (display)
        |-- required (required)
        |-- display (visibility)
        |-- ui (UI component)
        -- ...type-specific fields
```

**Core Relationships**:

| Concept            | Responsibility                                                | Analogy                |
| ------------------ | ------------------------------------------------------------- | ---------------------- |
| `Property`         | Define parameter **data model** — type, constraints, defaults | JSON Schema            |
| `PropertyUI`       | Define parameter **rendering method** — component, style      | UI Hint                |
| `DisplayCondition` | Define parameter **visibility** — when to show/hide           | Conditional expression |

A `Property` determines its data type via `type` and specifies rendering component via `ui`. **Different `type` values support different `ui` components.**
