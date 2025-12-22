---
title: Code Tool Node
description: Provide executable code tools for AI Agents, enabling AI to call custom code logic
---

# Code Tool Node

The Code Tool node provides executable code tools for AI Agents. Unlike Code Action nodes, Tool Code nodes don't execute directly - they register as tools with AI Agents, which decide whether to call them based on user needs.

## Use Cases

### Typical Applications
- **Data Processing Tools** - Provide complex data transformation and calculation capabilities
- **External System Integration** - Encapsulate interaction logic with third-party systems
- **Business Rule Calculation** - Implement specific business logic (pricing, inventory checks)
- **Format Conversion Tools** - Provide various data format conversion capabilities
- **Validation Tools** - Implement complex data validation logic
- **Custom Features** - Provide project-specific capabilities for AI Agents

## Tool vs Action Differences

### Code Action Node
- **Direct Execution**: Executes in workflow sequence
- **Deterministic**: Runs every time
- **Control Flow**: Execution timing controlled by workflow designer

### Code Tool Node
- **On-demand Calling**: Registered as tool, AI decides whether to call
- **Intelligent Selection**: AI decides based on user needs and tool description
- **Multi-tool Collaboration**: Can register multiple tools, AI autonomously selects appropriate tool combinations

```
Traditional Action Node Flow:
Trigger → Action 1 → Action 2 → Action 3 (fixed sequence)

Tool Node Flow:
Trigger → AI Agent (registered with Tool 1, Tool 2, Tool 3)
  → AI autonomously decides based on conversation:
    - Don't call any tools
    - Call Tool 1
    - Call Tool 2 then Tool 1
    - Call same tool multiple times
```

## Node Configuration

### Basic Settings (Parameters Panel)

#### Tool Name (toolName)

Unique identifier used by AI Agent to call the tool.

**Field Properties**:
- Required field
- Must be unique within the workflow
- Does not support expressions
- Format requirements:
  - Only letters, numbers, underscores, and hyphens allowed
  - Must start with a letter
  - Cannot duplicate tool names of other tool nodes in the workflow

**Configuration Examples**:

```javascript
// 1. Concise and clear tool name
toolName: "calculatePrice"

// 2. Descriptive tool name
toolName: "validateEmailFormat"

// 3. Tool name with prefix
toolName: "productInventoryCheck"

// 4. Tool name with underscore
toolName: "user_profile_query"
```

**Naming Recommendations**:
- **Use camelCase or underscore**: `calculatePrice` or `calculate_price`
- **Self-explanatory**: Name should clearly express tool functionality
- **Avoid too long**: Recommended within 20 characters
- **Avoid special characters**: Only use letters, numbers, underscores, and hyphens

**Important Notes**:
- AI Agent identifies and calls tools by tool name, not node name
- Tool name must be unique in the workflow; duplicate names will automatically get a suffix
- English naming is recommended for consistency with AI calls

#### Tool Description (toolDescription)

Describes the tool's functionality and use cases. AI uses this description to decide whether to call the tool.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Clearly describe tool functionality
"Calculate the sum of two numbers. Input parameters: number1 (first number), number2 (second number). Returns: sum (sum of both numbers)."

// 2. Explain use cases
"Query product inventory quantity. Input parameters: productId (product ID). Returns: quantity (current stock), lastUpdated (last update time). Use when answering user questions about product inventory."

// 3. Provide call examples
"Convert text to Markdown format.
Input parameters:
- text: Text content to convert
- style: Style option ('simple' | 'detailed')
Returns:
- markdown: Converted Markdown text

Example: Call convertToMarkdown tool when user says 'convert this text to Markdown'."

// 4. Explain limitations
"Calculate product discount price.
Input parameters:
- originalPrice: Original price (must be greater than 0)
- discountRate: Discount rate (between 0-1, e.g., 0.8 means 20% off)
Returns:
- finalPrice: Discounted price
- savedAmount: Amount saved

Note: Only for regular products, not applicable to sale items."
```

**Best Practices**:
- **Be specific**: Clearly state what the tool does
- **Detail parameters**: List all input parameters and their meanings
- **Clarify returns**: Explain what the tool returns
- **Use cases**: Help AI understand when to call the tool (reference by tool name)
- **Limitations**: Explain tool's applicability and restrictions

#### Language (lang)

Select the programming language for code execution.

**Field Properties**:
- Required field
- Default: `python3`

**Available Values**:
- `python3` - Python 3 code
- `javascript` - JavaScript code

#### Code (code)

Code content to execute.

**Field Properties**:
- Required field
- Supports multi-line text
- Must include `main` function

**Python3 Code Template**:
```python
def main(arg1: str, arg2: str):
    # Your code logic
    return {
        "result": arg1 + arg2,
    }
```

**JavaScript Code Template**:
```javascript
function main({arg1, arg2}) {
    // Your code logic
    return {
        result: arg1 + arg2
    }
}
```

**Code Requirements**:
1. **Must include main function**: Code entry point
2. **Parameter mapping**: main function parameter names must match input variable names
3. **Return object**: Must return object with keys matching output variable names
4. **No side effects**: Avoid modifying global state
5. **Error handling**: Handle possible error cases

#### Input Variables (inputs)

Define parameters AI needs to pass when calling the tool.

**Field Properties**:
- Array type
- Each input includes: variable (variable name), value (default value)
- Variable names cannot be duplicated
- Default has two inputs: `arg1`, `arg2`

**Configuration Examples**:

```javascript
// 1. Basic input definition
inputs: [
  { variable: "text", value: "" },
  { variable: "language", value: "zh-CN" }
]

// 2. Inputs with default values
inputs: [
  { variable: "query", value: "" },
  { variable: "limit", value: "10" },
  { variable: "offset", value: "0" }
]

// 3. Dynamic input values (using expressions)
inputs: [
  { variable: "userId", value: $('Chat Trigger').userId },
  { variable: "sessionId", value: $('Chat Trigger').sessionId }
]
```

**Variable Naming Conventions**:
- Use camelCase: `productId`, `userName`
- Self-explanatory: Variable names should clearly express purpose
- Avoid abbreviations: Use `quantity` instead of `qty`

#### Output Variables (outputs)

Define data returned to AI after tool execution.

**Field Properties**:
- Array type
- Each output includes: variable (variable name), type (data type)
- Variable names cannot be duplicated
- Default has one output: `result` (string type)

**Supported Data Types**:
```yaml
string: String
number: Number
boolean: Boolean
object: Object
array[string]: String array
array[number]: Number array
array[boolean]: Boolean array
array[object]: Object array
```

**Configuration Examples**:

```javascript
// 1. Single output
outputs: [
  { variable: "result", type: "string" }
]

// 2. Multiple outputs
outputs: [
  { variable: "success", type: "boolean" },
  { variable: "message", type: "string" },
  { variable: "data", type: "object" }
]

// 3. Array type outputs
outputs: [
  { variable: "products", type: "array[object]" },
  { variable: "totalCount", type: "number" }
]

// 4. Complex output structure
outputs: [
  { variable: "status", type: "string" },
  { variable: "items", type: "array[object]" },
  { variable: "pagination", type: "object" },
  { variable: "hasMore", type: "boolean" }
]
```

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output empty item even on execution failure.

**Default**: `false`

#### Execute Once (executeOnce)

Whether to execute only once using the first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry on execution failure.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Price calculation tool - Calculate final price based on original price and discount"
```

## Code Examples

### Example 1: Math Calculation Tool

**Python Version**:
```python
def main(operation: str, num1: float, num2: float):
    """
    Perform math operations
    """
    if operation == "add":
        result = num1 + num2
    elif operation == "subtract":
        result = num1 - num2
    elif operation == "multiply":
        result = num1 * num2
    elif operation == "divide":
        if num2 == 0:
            return {
                "success": False,
                "error": "Divisor cannot be 0"
            }
        result = num1 / num2
    else:
        return {
            "success": False,
            "error": f"Unsupported operation: {operation}"
        }

    return {
        "success": True,
        "result": result
    }
```

**Input Variables**:
```javascript
[
  { variable: "operation", value: "" },  // "add" | "subtract" | "multiply" | "divide"
  { variable: "num1", value: "0" },
  { variable: "num2", value: "0" }
]
```

**Output Variables**:
```javascript
[
  { variable: "success", type: "boolean" },
  { variable: "result", type: "number" },
  { variable: "error", type: "string" }
]
```

**Tool Description**:
```
Perform basic math operations (add, subtract, multiply, divide).
Input parameters:
- operation: Operation type ("add", "subtract", "multiply", "divide")
- num1: First number
- num2: Second number
Returns:
- success: Whether successful
- result: Calculation result (only when successful)
- error: Error message (only when failed)
```

### Example 2: Text Processing Tool

**JavaScript Version**:
```javascript
function main({text, operation, options}) {
    const opts = JSON.parse(options || '{}');

    switch(operation) {
        case 'uppercase':
            return {
                result: text.toUpperCase()
            };

        case 'lowercase':
            return {
                result: text.toLowerCase()
            };

        case 'word_count':
            const words = text.trim().split(/\s+/);
            return {
                result: words.length.toString(),
                words: words
            };

        case 'extract_emails':
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const emails = text.match(emailRegex) || [];
            return {
                emails: emails,
                count: emails.length
            };

        case 'truncate':
            const maxLength = opts.maxLength || 100;
            const suffix = opts.suffix || '...';
            if (text.length <= maxLength) {
                return { result: text };
            }
            return {
                result: text.substring(0, maxLength - suffix.length) + suffix
            };

        default:
            return {
                error: `Unsupported operation: ${operation}`
            };
    }
}
```

**Input Variables**:
```javascript
[
  { variable: "text", value: "" },
  { variable: "operation", value: "uppercase" },
  { variable: "options", value: "{}" }  // JSON format options
]
```

**Output Variables**:
```javascript
[
  { variable: "result", type: "string" },
  { variable: "words", type: "array[string]" },
  { variable: "emails", type: "array[string]" },
  { variable: "count", type: "number" },
  { variable: "error", type: "string" }
]
```

### Example 3: Data Validation Tool

**Python Version**:
```python
import re
import json

def main(data: str, validation_type: str, rules: str):
    """
    Validate if data conforms to rules
    """
    try:
        rules_obj = json.loads(rules) if rules else {}
    except:
        return {
            "valid": False,
            "errors": ["Rule format error"]
        }

    errors = []

    if validation_type == "email":
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data):
            errors.append("Invalid email format")

    elif validation_type == "phone":
        phone_pattern = r'^1[3-9]\d{9}$'
        if not re.match(phone_pattern, data):
            errors.append("Invalid phone number format")

    elif validation_type == "url":
        url_pattern = r'^https?://[^\s/$.?#].[^\s]*$'
        if not re.match(url_pattern, data):
            errors.append("Invalid URL format")

    elif validation_type == "custom":
        # Custom validation logic
        min_length = rules_obj.get("minLength", 0)
        max_length = rules_obj.get("maxLength", float('inf'))
        pattern = rules_obj.get("pattern", "")

        if len(data) < min_length:
            errors.append(f"Length cannot be less than {min_length} characters")

        if len(data) > max_length:
            errors.append(f"Length cannot exceed {max_length} characters")

        if pattern and not re.match(pattern, data):
            errors.append("Does not meet specified format requirements")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "data": data if len(errors) == 0 else None
    }
```

**Input Variables**:
```javascript
[
  { variable: "data", value: "" },
  { variable: "validation_type", value: "email" },  // "email" | "phone" | "url" | "custom"
  { variable: "rules", value: "{}" }  // JSON format validation rules
]
```

**Output Variables**:
```javascript
[
  { variable: "valid", type: "boolean" },
  { variable: "errors", type: "array[string]" },
  { variable: "data", type: "string" }
]
```

## Workflow Examples

### Example 1: Provide Calculation Capability for AI Agent

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an intelligent assistant that helps users with math calculations."
    Tools: [Code Tool - Math Calculator]
      Tool Description: "Perform math calculations, supports add, subtract, multiply, divide. Input: operation (operation type), num1 (first number), num2 (second number). Returns: result (calculation result)."
      Code: [Math calculation Python code]
      Inputs: [operation, num1, num2]
      Outputs: [success, result, error]
  → Answer Node

User dialogue example:
User: "Help me calculate 123 + 456"
AI: (calls calculation tool) → Returns: "123 + 456 = 579"

User: "What's 1000 divided by 7?"
AI: (calls calculation tool) → Returns: "1000 ÷ 7 ≈ 142.857"
```

### Example 2: Multi-tool Collaboration - Order Processing Assistant

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an order processing assistant that can query orders, check inventory, and calculate prices."

    Tools: [
      Tool 1 - Order Query Tool
        Tool Description: "Query order details by order number. Input: orderId. Returns: order (order object), found (whether found)."

      Tool 2 - Inventory Check Tool
        Tool Description: "Check product inventory. Input: productId. Returns: inStock (whether in stock), quantity (inventory quantity)."

      Tool 3 - Price Calculation Tool
        Tool Description: "Calculate order total. Input: items (product list), discountCode (discount code). Returns: totalPrice (total price), discount (discount amount)."
    ]
  → Answer Node

User dialogue example:
User: "Where's my order #12345?"
AI: (calls order query tool) → "Your order has shipped and will arrive tomorrow."

User: "Is product SKU-999 in stock?"
AI: (calls inventory check tool) → "Yes, current inventory has 50 units."

User: "Help me calculate this cart total"
AI: (calls price calculation tool) → "Total is 299 yuan, after discount code pays 249 yuan."
```

### Example 3: Data Processing Assistant

```
Chat Trigger
  → Entity Recognition Node (Extract user input data)
  → AI Agent Node
    System Prompt: "You are a data processing assistant that can perform various data processing and analysis."

    Tools: [
      Tool 1 - Text Processing Tool
        Tool Description: "Process text content, supports uppercase, lowercase, word count, email extraction, etc."
        Code: [Text processing JavaScript code]

      Tool 2 - Data Validation Tool
        Tool Description: "Validate data format, supports email, phone, URL format validation."
        Code: [Data validation Python code]

      Tool 3 - Format Conversion Tool
        Tool Description: "Convert data formats like JSON, CSV, XML, etc."
        Code: [Format conversion code]
    ]
  → Answer Node

User dialogue example:
User: "Convert this text to uppercase: hello world"
AI: (calls text processing tool - uppercase) → "HELLO WORLD"

User: "Check if this email format is correct: test@example"
AI: (calls data validation tool - email) → "Email format is incorrect, missing domain suffix."
```

### Example 4: Dynamic Tool Selection

```
Chat Trigger
  → AI Classifier Node (Identify user intent)
  → Conditional Branch
    → [Calculation Need] → AI Agent (register math tools)
    → [Data Processing Need] → AI Agent (register data processing tools)
    → [Query Need] → AI Agent (register query tools)
  → Answer Node
```

## Best Practices

### 1. Write Clear Tool Descriptions

**Good tool description**:
```
"Calculate number of days between two dates.
Input parameters:
- startDate: Start date, format YYYY-MM-DD
- endDate: End date, format YYYY-MM-DD
Returns:
- days: Number of days difference (integer)
- valid: Whether dates are valid (boolean)

Use case: Call when user asks how many days between two dates.
Example: 'How many days from January 1, 2024 to December 31, 2024?'"
```

**Poor tool description**:
```
"Date calculation"
```

### 2. Design Clear Input/Output

**Clear input/output design**:
```javascript
// Input: Semantically clear, has default values
inputs: [
  { variable: "searchQuery", value: "" },
  { variable: "maxResults", value: "10" },
  { variable: "sortBy", value: "relevance" }
]

// Output: Correct types, complete structure
outputs: [
  { variable: "results", type: "array[object]" },
  { variable: "totalCount", type: "number" },
  { variable: "hasMore", type: "boolean" }
]
```

### 3. Handle Errors and Edge Cases

**Comprehensive error handling**:
```python
def main(numerator: float, denominator: float):
    # Edge case check
    if denominator == 0:
        return {
            "success": False,
            "error": "Divisor cannot be 0",
            "result": None
        }

    try:
        result = numerator / denominator
        return {
            "success": True,
            "result": result,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Calculation error: {str(e)}",
            "result": None
        }
```

### 4. Provide Appropriate Default Values

```javascript
// Good practice
inputs: [
  { variable: "text", value: "" },
  { variable: "maxLength", value: "100" },  // Reasonable default
  { variable: "language", value: "en-US" }  // Common language
]

// Poor practice
inputs: [
  { variable: "text", value: "" },
  { variable: "maxLength", value: "" },  // Missing default
  { variable: "language", value: "" }
]
```

### 5. Maintain Appropriate Tool Granularity

**Appropriate tool granularity**:
```javascript
// Good: One tool does one thing
Tool 1: "Calculate price - Calculate total based on quantity and unit price"
Tool 2: "Apply discount - Calculate discounted price based on discount code"
Tool 3: "Calculate tax - Calculate tax based on region"

// Bad: Tool too large, unclear responsibilities
Tool 1: "Order processing - Calculate price, apply discount, calculate tax, generate invoice"
```

### 6. Use Type Hints

**Python type hints**:
```python
from typing import Dict, List, Optional

def main(
    items: List[Dict],
    discount_rate: float,
    currency: str
) -> Dict[str, any]:
    """
    Type hints make code clearer and easier to maintain
    """
    total = sum(item['price'] * item['quantity'] for item in items)
    discount = total * discount_rate
    final_price = total - discount

    return {
        "total": total,
        "discount": discount,
        "finalPrice": final_price,
        "currency": currency
    }
```

### 7. Test Tool Functionality

**Testing strategy**:
1. **Unit tests**: Test various input cases
2. **Boundary tests**: Test extreme values and boundary conditions
3. **Error tests**: Test error input handling
4. **Integration tests**: Test tool calls in AI Agent

```python
# Test case example
def main(value: str, operation: str):
    # Test: Empty value handling
    if not value:
        return {"error": "Input cannot be empty"}

    # Test: Operation type check
    if operation not in ["uppercase", "lowercase", "capitalize"]:
        return {"error": "Unsupported operation"}

    # Normal processing
    if operation == "uppercase":
        return {"result": value.upper()}
    elif operation == "lowercase":
        return {"result": value.lower()}
    else:
        return {"result": value.capitalize()}
```

## FAQ

### Q1: What's the difference between Code Tool and Code Action?

**A**:

| Feature | Code Action | Code Tool |
|---------|------------|-----------|
| Execution Method | Direct execution | AI calls on demand |
| Use Case | Fixed data processing flow | AI Agent capabilities |
| Execution Timing | Always executes | AI decides whether to execute |
| Suitable For | Deterministic business processes | Uncertain interaction scenarios |

**Selection Advice**:
- For fixed processes (like "always validate input"), use **Code Action**
- For on-demand capabilities (like "AI might need to calculate price"), use **Code Tool**

### Q2: How does AI decide whether to call a tool?

**A**:
AI decides based on:
1. **Tool description**: Whether description matches user needs
2. **Dialogue context**: Whether current conversation needs this capability
3. **Input parameters**: Whether required parameters can be extracted from conversation
4. **Available tools**: Compares multiple tools, selects most appropriate

**Optimize AI tool selection**:
- Write clear, accurate tool descriptions
- Provide use cases and examples
- Reasonably name input/output variables
- Avoid overlapping tool functionality

### Q3: How to handle tool call failures?

**A**:

**Option 1: Handle in code**
```python
def main(value: str):
    try:
        result = complex_operation(value)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": None
        }
```

**Option 2: Use retry settings**
```javascript
Settings:
  retryOnFail: true
  maxTries: 3
  waitBetweenTries: 1000
```

**Option 3: AI auto-handles**
```
When AI tool call fails, it will:
1. Identify failure reason (from error output)
2. Adjust parameters and retry
3. Or try other tools
4. Or tell user cannot complete
```

### Q4: Can tools call external APIs?

**A**:
Not recommended to directly call external APIs in Code Tool because:
1. **Performance**: Synchronous calls block AI
2. **Reliability**: External APIs may be unstable
3. **Architecture**: Should use HTTP Request Tool

**Recommended approach**:
```
Chat Trigger
  → AI Agent
    Tools: [
      HTTP Request Tool (call external API)
      Code Tool (process API returned data)
    ]
```

AI will first call HTTP Request Tool to get data, then call Code Tool to process data.

### Q5: How many tools can be registered?

**A**:
No hard technical limit, but recommended:
- **3-5 tools**: Best practice
- **Max 10 tools**: More may affect AI selection accuracy

**Optimization strategy**:
```javascript
// Option 1: One tool supports multiple operations
Tool: "Text Processing"
Input: operation ("uppercase" | "lowercase" | "trim" | ...)

// Option 2: Dynamically register tools
Conditional Branch
  → [Scenario A] → AI Agent (register tools 1, 2, 3)
  → [Scenario B] → AI Agent (register tools 4, 5, 6)
```

### Q6: How are tool input parameters passed?

**A**:

**AI extracts parameters from conversation**:
```
User: "Help me calculate 100 plus 200"
AI analyzes:
  - Need to call calculation tool
  - operation = "add"
  - num1 = 100
  - num2 = 200
  → Call tool
```

**If parameters insufficient, AI will ask**:
```
User: "Help me calculate"
AI: "Sure, what would you like to calculate? For example, addition, subtraction?"
User: "100 plus 200"
AI: → Call tool
```

**Can also get from context**:
```javascript
// Set default values when configuring tool
inputs: [
  { variable: "userId", value: $('Chat Trigger').userId },  // From dialogue context
  { variable: "value", value: "" }  // AI extracts from conversation
]
```

### Q7: What are the limitations of Code Tool code?

**A**:

**Limitations**:
1. **Execution time**: Usually has timeout limit (e.g., 30 seconds)
2. **Memory usage**: Has memory limits
3. **Network access**: May not allow external network calls
4. **File system**: May not allow file read/write
5. **Library dependencies**: Only standard library or pre-installed libraries supported

**Best practices**:
- Write efficient code
- Avoid complex calculations
- Don't depend on external resources
- Handle timeout cases

```python
def main(data: str):
    # Good: Simple and direct
    return {"result": data.upper()}

    # Bad: Complex and time-consuming
    # for i in range(1000000):
    #     complex_calculation()
```

### Q8: How to debug Code Tool?

**A**:

**Debugging strategies**:

**1. Log output**
```python
def main(value: str):
    # Python uses print
    print(f"Debug: input value = {value}")

    result = process(value)
    print(f"Debug: result = {result}")

    return {"result": result}
```

```javascript
// JavaScript uses console.log
function main({value}) {
    console.log('Debug: input value =', value);

    const result = process(value);
    console.log('Debug: result =', result);

    return { result };
}
```

**2. Return debug information**
```python
def main(value: str):
    debug_info = []
    debug_info.append(f"Input: {value}")

    result = process(value)
    debug_info.append(f"Process result: {result}")

    return {
        "result": result,
        "debug": debug_info  // Temporary output variable
    }
```

**3. Test in Code Action first**
```
Development process:
1. First write and test code in Code Action
2. After confirming code is correct, copy to Code Tool
3. Add tool description
4. Test in AI Agent
```

### Q9: Can tools return complex objects?

**A**:
Yes, use `object` or `array[object]` type:

```python
def main(product_id: str):
    # Return complex object
    product = {
        "id": product_id,
        "name": "Example Product",
        "price": 99.99,
        "inStock": True,
        "tags": ["Electronics", "Popular"],
        "specs": {
            "weight": "500g",
            "dimensions": "10x10x10cm"
        }
    }

    return {
        "product": product,  // object type
        "success": True
    }
```

**Output variable configuration**:
```javascript
outputs: [
  { variable: "product", type: "object" },
  { variable: "success", type: "boolean" }
]
```

**AI can access object properties**:
```
After AI gets product object, it can:
- Read product.name
- Read product.price
- Read product.specs.weight
- Present information to user
```

## Next Steps

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Learn how to use AI Agents
- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) - Provide API calling capability for AI
- [Entity Recognition Tool Node](/en/guide/workflow/nodes/tool-nodes/entity-recognition) - Provide structured extraction capability for AI

## Related Resources

- [Code Action Node](/en/guide/workflow/nodes/action-nodes/code) - Understand differences between Action and Tool
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in configuration
