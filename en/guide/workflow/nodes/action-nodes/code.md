---
title: Code Node
description: Extend workflow functionality with Python or JavaScript code
---

# Code Node

The Code node allows you to execute custom Python or JavaScript code in your workflow, enabling complex data transformations, business logic, and algorithmic processing. It provides flexible input/output mechanisms to pass workflow data to code and retrieve execution results.

## Use Cases

### Typical Applications
- **Complex Data Processing** - Implement complex transformation logic beyond workflow expressions
- **Custom Algorithms** - Execute specific calculations or algorithmic processing
- **Data Validation** - Implement complex data validation rules using code
- **Format Conversion** - Convert between different data formats (JSON, XML, CSV, etc.)
- **Business Logic** - Implement specific business rules and calculation logic
- **Third-party Library Integration** - Leverage rich libraries from Python/JavaScript ecosystems

## Node Configuration

### Basic Settings (Parameters Panel)

#### Code Content (code)

The code to execute. This is a required parameter.

**Field Properties**:
- Required field
- Supports Python3 and JavaScript
- Multi-line code editor
- Syntax highlighting and auto-completion

**Python3 Example**:

```python
def main(arg1: str, arg2: str):
    return {
        "result": arg1 + arg2,
    }
```

**JavaScript Example**:

```javascript
function main({arg1, arg2}) {
    return {
        result: arg1 + arg2
    }
}
```

#### Programming Language (lang)

Select the programming language for the code.

**Available Values**:
- `python3` - Python 3.x (default)
- `javascript` - JavaScript (ES6+)

#### Input Parameters (inputs)

Define input variables to pass to the code.

**Field Properties**:
- Array type, can add multiple inputs
- Each input contains:
  - `variable` - Variable name (required, must follow variable naming rules)
  - `value` - Variable value (required, supports expressions)
- Variable names must be unique
- Defaults to `arg1` and `arg2` inputs

**Configuration Examples**:

```javascript
// Input 1
variable: "userMessage"
value: $('Webhook Trigger').body.message

// Input 2
variable: "userId"
value: $('Webhook Trigger').body.userId

// Input 3
variable: "timestamp"
value: new Date().toISOString()
```

#### Output Variables (outputs)

Define output variables returned by code and their types.

**Field Properties**:
- Array type, can add multiple outputs
- Each output contains:
  - `variable` - Variable name (required, must follow variable naming rules)
  - `type` - Data type (required)
- Variable names must be unique
- Defaults to one `result` output (type string)

**Supported Data Types**:
- `string` - String
- `number` - Number
- `boolean` - Boolean
- `object` - Object
- `array[string]` - String array
- `array[number]` - Number array
- `array[boolean]` - Boolean array
- `array[object]` - Object array

**Configuration Examples**:

```javascript
// Output 1
variable: "result"
type: "string"

// Output 2
variable: "count"
type: "number"

// Output 3
variable: "items"
type: "array[object]"
```

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output an empty item when output is empty.

**Default**: `false`

**Purpose**: Prevents workflow from terminating at this node, ensuring subsequent nodes can execute.

#### Execute Once (executeOnce)

Whether to execute only once using data from the first input item.

**Default**: `false`

**Purpose**:
- By default, code executes for each item when upstream nodes return multiple items
- Enable this to execute only for the first item, improving performance

#### Retry on Fail (retryOnFail)

Whether to automatically retry when code execution fails.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

**Prerequisite**: `retryOnFail` must be `true`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

**Prerequisite**: `retryOnFail` must be `true`

#### Error Handling (onError)

How to handle code execution failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue with regular output
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Process user input and calculate recommendation results"
```

## Code Writing Guide

### Python3 Code Standards

#### Basic Structure

```python
def main(arg1, arg2, arg3):
    # Your code logic

    # Return dictionary where keys match output variable names
    return {
        "result": "processing result",
        "count": 42,
        "items": [1, 2, 3]
    }
```

#### Type Annotations

```python
def main(user_id: str, score: int) -> dict:
    return {
        "message": f"User {user_id} scored {score}"
    }
```

#### Error Handling

```python
def main(data: str):
    try:
        parsed = json.loads(data)
        return {"result": parsed}
    except Exception as e:
        raise ValueError(f"JSON parsing failed: {str(e)}")
```

#### Using Standard Library

```python
import json
import re
from datetime import datetime

def main(text: str):
    # Extract emails using regex
    emails = re.findall(r'[\w\.-]+@[\w\.-]+', text)

    return {
        "emails": emails,
        "count": len(emails),
        "timestamp": datetime.now().isoformat()
    }
```

### JavaScript Code Standards

#### Basic Structure

```javascript
function main({arg1, arg2, arg3}) {
    // Your code logic

    // Return object where keys match output variable names
    return {
        result: "processing result",
        count: 42,
        items: [1, 2, 3]
    }
}
```

#### Arrow Functions

```javascript
const main = ({userId, score}) => {
    return {
        message: `User ${userId} scored ${score}`
    }
}
```

#### Error Handling

```javascript
function main({data}) {
    try {
        const parsed = JSON.parse(data)
        return {result: parsed}
    } catch (e) {
        throw new Error(`JSON parsing failed: ${e.message}`)
    }
}
```

#### Using Modern JavaScript

```javascript
function main({items, threshold}) {
    // Array operations
    const filtered = items.filter(item => item.value > threshold)
    const mapped = filtered.map(item => ({
        ...item,
        processed: true
    }))

    // Object spreading
    const result = {
        items: mapped,
        total: mapped.length,
        timestamp: new Date().toISOString()
    }

    return result
}
```

## Output Data

Code node outputs are determined by variables defined in `outputs`.

```javascript
// Access individual output variables
$('Code').result
$('Code').count
$('Code').items

// Access array outputs
$('Code').items[0]
$('Code').items.length

// Access object outputs
$('Code').data.name
$('Code').data.age
```

## Workflow Examples

### Example 1: Data Cleaning and Validation

```
Webhook Trigger
  → Code Node
    Language: Python3
    Inputs:
      - email: $('Webhook Trigger').body.email
      - phone: $('Webhook Trigger').body.phone
    Code:
      import re

      def main(email: str, phone: str):
          # Validate email
          email_valid = bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email))

          # Clean phone number (remove non-digits)
          phone_clean = re.sub(r'\D', '', phone)
          phone_valid = len(phone_clean) == 11

          return {
              "email_valid": email_valid,
              "phone_valid": phone_valid,
              "phone_clean": phone_clean,
              "all_valid": email_valid and phone_valid
          }
    Outputs:
      - email_valid: boolean
      - phone_valid: boolean
      - phone_clean: string
      - all_valid: boolean
  → Conditional Branch
    Condition: $('Code').all_valid === true
```

### Example 2: Complex Business Calculations

```
HTTP Request (Query order data)
  → Code Node
    Language: JavaScript
    Inputs:
      - orders: $('HTTP Request').body.orders
      - taxRate: 0.13
    Code:
      function main({orders, taxRate}) {
          // Calculate order statistics
          const stats = orders.reduce((acc, order) => {
              const subtotal = order.items.reduce((sum, item) =>
                  sum + (item.price * item.quantity), 0)
              const tax = subtotal * taxRate
              const total = subtotal + tax

              return {
                  count: acc.count + 1,
                  subtotal: acc.subtotal + subtotal,
                  tax: acc.tax + tax,
                  total: acc.total + total
              }
          }, {count: 0, subtotal: 0, tax: 0, total: 0})

          return {
              orderCount: stats.count,
              subtotal: stats.subtotal.toFixed(2),
              tax: stats.tax.toFixed(2),
              total: stats.total.toFixed(2),
              avgOrderValue: (stats.total / stats.count).toFixed(2)
          }
      }
    Outputs:
      - orderCount: number
      - subtotal: string
      - tax: string
      - total: string
      - avgOrderValue: string
  → Answer Node
```

### Example 3: Text Processing and Analysis

```
Chat Trigger
  → Code Node
    Language: Python3
    Inputs:
      - text: $('Chat Trigger').message
    Code:
      import re
      from collections import Counter

      def main(text: str):
          # Clean text
          text_clean = re.sub(r'[^\w\s]', '', text.lower())

          # Tokenize (simple space split)
          words = text_clean.split()

          # Count word frequency
          word_freq = Counter(words)
          top_words = word_freq.most_common(5)

          # Basic statistics
          stats = {
              "char_count": len(text),
              "word_count": len(words),
              "unique_words": len(word_freq),
              "top_words": [{"word": w, "count": c} for w, c in top_words],
              "avg_word_length": sum(len(w) for w in words) / len(words) if words else 0
          }

          return stats
    Outputs:
      - char_count: number
      - word_count: number
      - unique_words: number
      - top_words: array[object]
      - avg_word_length: number
  → LLM Node (Generate response based on analysis)
```

### Example 4: JSON Transformation

```
Webhook Trigger
  → Code Node
    Language: JavaScript
    Inputs:
      - data: $('Webhook Trigger').body
    Code:
      function main({data}) {
          // Transform flat structure to nested structure
          const transformed = {
              user: {
                  id: data.user_id,
                  name: data.user_name,
                  email: data.user_email,
                  profile: {
                      age: data.age,
                      gender: data.gender
                  }
              },
              order: {
                  id: data.order_id,
                  amount: data.amount,
                  status: data.status
              },
              meta: {
                  timestamp: new Date().toISOString(),
                  source: 'webhook'
              }
          }

          return {result: transformed}
      }
    Outputs:
      - result: object
  → HTTP Request (Send transformed data)
```

### Example 5: Data Filtering and Sorting

```
Knowledge Retrieval
  → Code Node
    Language: Python3
    Inputs:
      - results: $('Knowledge Retrieval').results
      - minScore: 0.7
      - maxResults: 5
    Code:
      def main(results: list, minScore: float, maxResults: int):
          # Filter low-score results
          filtered = [r for r in results if r.get('score', 0) >= minScore]

          # Sort by score
          sorted_results = sorted(filtered, key=lambda x: x.get('score', 0), reverse=True)

          # Limit count
          top_results = sorted_results[:maxResults]

          # Format output
          formatted = [
              {
                  "title": r.get('title', ''),
                  "content": r.get('content', '')[:200],  # First 200 chars
                  "score": round(r.get('score', 0), 3),
                  "source": r.get('metadata', {}).get('source', 'unknown')
              }
              for r in top_results
          ]

          return {
              "results": formatted,
              "total": len(formatted),
              "filtered_count": len(filtered) - len(top_results)
          }
    Outputs:
      - results: array[object]
      - total: number
      - filtered_count: number
  → LLM Node
```

## Best Practices

### 1. Reasonable Input/Output Usage

**Clearly Define Inputs and Outputs**
```python
# Clear input/output definition
Inputs:
  - userId: $('Webhook Trigger').body.userId
  - action: $('Webhook Trigger').body.action
  - timestamp: new Date().getTime()

Outputs:
  - success: boolean
  - message: string
  - data: object
```

**Avoid Too Many Inputs**
```javascript
// Too many inputs - combine related data into object
inputs: ["field1", "field2", "field3", ...] // Too many

// Better approach
input: "userData"
value: {
  field1: $('Node').field1,
  field2: $('Node').field2,
  // ...
}
```

### 2. Error Handling

**Use try-catch**
```python
def main(data: str):
    try:
        result = complex_operation(data)
        return {"success": True, "result": result}
    except ValueError as e:
        return {"success": False, "error": f"Data validation failed: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"Unknown error: {str(e)}"}
```

**Validate Inputs**
```javascript
function main({email, age}) {
    // Input validation
    if (!email || typeof email !== 'string') {
        throw new Error('email must be a non-empty string')
    }

    if (typeof age !== 'number' || age < 0) {
        throw new Error('age must be a non-negative number')
    }

    // Business logic
    return {result: 'ok'}
}
```

### 3. Performance Optimization

**Avoid Unnecessary Loops**
```javascript
// Inefficient
function main({items}) {
    let result = []
    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < items.length; j++) {
            // O(n²) complexity
        }
    }
    return {result}
}

// Better approach
function main({items}) {
    const result = items.map(item => process(item)) // O(n)
    return {result}
}
```

**Use Execute Once Option**
```yaml
# When only need to process first item
settings:
  executeOnce: true
```

### 4. Code Readability

**Add Comments**
```python
def main(order_data: dict):
    # Step 1: Validate order data
    if not validate_order(order_data):
        raise ValueError("Invalid order data")

    # Step 2: Calculate discount
    discount = calculate_discount(order_data)

    # Step 3: Apply discount and return
    final_amount = order_data['amount'] * (1 - discount)

    return {
        "discount": discount,
        "final_amount": round(final_amount, 2)
    }
```

**Use Meaningful Variable Names**
```javascript
// Bad
function main({x, y}) {
    const z = x + y
    return {r: z}
}

// Good
function main({price, tax}) {
    const totalAmount = price + tax
    return {totalAmount}
}
```

### 5. Security Considerations

**Don't Hardcode Sensitive Information**
```python
# Don't do this
def main(data: str):
    api_key = "sk-xxxxxxxxxxxxx"  # Hardcoded
    # ...

# Should pass through input parameter
def main(data: str, api_key: str):
    # Use api_key
    # ...
```

**Input Validation and Sanitization**
```javascript
function main({userInput}) {
    // Sanitize user input to prevent injection attacks
    const cleaned = userInput.replace(/[<>]/g, '')

    return {cleaned}
}
```

## FAQ

### Q1: Which Python/JavaScript versions does the Code node support?

**A**:
- **Python**: Python 3.x (specific version depends on runtime environment)
- **JavaScript**: ES6+ syntax, supports modern JavaScript features

### Q2: Can I use third-party libraries in code?

**A**: Depends on runtime environment configuration:
- **Python**: Usually supports standard library (json, re, datetime, etc.)
- **JavaScript**: Supports ES6+ built-in objects and methods
- Third-party library support requires pre-installation in runtime environment

### Q3: Is there a time limit for code execution?

**A**: Yes, there's usually an execution timeout limit (e.g., 30 seconds) to prevent infinite execution. When writing code:
- Avoid infinite loops
- Optimize algorithm complexity
- Use batch processing for large datasets

### Q4: What are the naming rules for input/output variables?

**A**:
- Must start with a letter or underscore
- Can only contain letters, numbers, underscores
- Cannot use Python/JavaScript reserved words
- Case-sensitive
- Recommend meaningful camelCase or snake_case naming

**Valid Examples**:
```
userId, user_name, _temp, data1
```

**Invalid Examples**:
```
1user (starts with number)
user-name (contains hyphen)
class (reserved word)
```

### Q5: Must code return values exactly match output definitions?

**A**: Yes. The keys in the object returned by code must match the `variable` names defined in `outputs`.

**Example**:
```javascript
// Output definition
outputs: [
  {variable: "result", type: "string"},
  {variable: "count", type: "number"}
]

// Code must return
return {
  result: "some string",
  count: 42
}

// Missing fields or mismatched field names will cause errors
```

### Q6: How to choose between Python and JavaScript?

**A**: Consider these factors:
- **Python**:
  - Better for data processing and scientific computing
  - More concise and readable code
  - Rich standard library (regex, date handling, etc.)

- **JavaScript**:
  - Better for JSON data operations
  - More flexible object and array operations
  - Better match with frontend data structures

Recommendation: Prioritize the language your team is most familiar with.

### Q7: Can the Code node call external APIs?

**A**: Generally not recommended to call external APIs directly in Code node:
- Use **HTTP Request node** to call external APIs
- Code node should focus on data processing and transformation logic
- This better leverages HTTP node's error handling, retry features

### Q8: How to debug the Code node?

**A**: Debugging suggestions:
1. **Use Answer node to output intermediate results**
   ```python
   def main(data: str):
       intermediate = process_step1(data)
       # Return intermediate result for inspection
       return {"intermediate": str(intermediate)}
   ```

2. **Add detailed error messages**
   ```python
   try:
       result = process(data)
   except Exception as e:
       return {"error": f"Processing failed: {str(e)}, data: {data}"}
   ```

3. **Return step-by-step results**
   ```python
   return {
       "step1_result": step1,
       "step2_result": step2,
       "final_result": final
   }
   ```

4. **Use workflow logs** - View node execution logs and error details

## Next Steps

- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Learn how to call external APIs
- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Branch based on code execution results
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in input parameters

## Related Resources

- [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) - Learn how to receive external data
- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Combine Code node with AI capabilities
