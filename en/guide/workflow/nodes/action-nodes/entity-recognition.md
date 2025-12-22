---
title: Entity Recognition Node
description: Extract structured entity information from text
---

# Entity Recognition Node

The Entity Recognition node uses AI models to automatically identify and extract structured entity information from unstructured text, such as names, locations, dates, amounts, product names, etc. It converts text into structured data for easier processing and analysis.

## Use Cases

### Typical Applications
- **Customer Information Extraction** - Extract contact details like name, phone, email from user messages
- **Order Information Parsing** - Identify order elements like product names, quantities, prices, shipping addresses
- **Resume Parsing** - Extract structured information like education, work experience, skills from resumes
- **Smart Form Filling** - Extract information from conversations to auto-fill form fields
- **Document Information Extraction** - Extract key fields from contracts, invoices, reports
- **Event Extraction** - Identify elements like time, location, people, events from text
- **Product Attribute Extraction** - Extract brand, model, specifications from product descriptions

## Node Configuration

### Basic Settings (Parameters Panel)

#### Model (model)

Select the AI model for entity recognition.

**Field Properties**:
- Required field
- Supports mainstream LLM providers (OpenAI, Anthropic, Google, etc.)
- Model selection affects recognition accuracy and cost

**Recommended Models**:
- **GPT-4** - High accuracy, suitable for complex entity recognition
- **GPT-3.5-turbo** - Cost-effective, suitable for simple entity extraction
- **Claude** - Suitable for long text processing

#### Input Text (input)

The text content for entity recognition.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Reference Webhook data
$('Webhook Trigger').body.message

// 2. Reference chat message
$('Chat Trigger').message

// 3. Reference upstream node output
$('HTTP Request').body.description

// 4. Concatenate multiple fields
`Name: ${$('Form').name}
Phone: ${$('Form').phone}
Address: ${$('Form').address}`
```

#### Instructions (instructions)

Provide additional recognition guidance for the model.

**Field Properties**:
- Optional field
- Supports multi-line text
- Used to provide context or specific requirements

**Configuration Examples**:

```javascript
// Example 1: Specify date format
"Please convert all dates to YYYY-MM-DD format"

// Example 2: Provide business context
"This is a customer complaint message, focus on extracting issue type, product name, and expected resolution"

// Example 3: Specify extraction rules
"Phone numbers should include country code, amount unit is unified as RMB"

// Example 4: Handle ambiguous cases
"If address is incomplete, extract province and city info as much as possible; if no explicit time, mark as null"
```

#### JSON Schema (jsonSchema)

Define the structure and fields of entities to extract.

**Field Properties**:
- Optional field
- Defined in JSON Schema format
- Supports visual editor
- Provides preset templates

**Basic Example**:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Customer name"
    },
    "phone": {
      "type": "string",
      "description": "Contact phone"
    },
    "email": {
      "type": "string",
      "description": "Email address"
    }
  },
  "required": ["name"]
}
```

**Complex Example**:

```json
{
  "type": "object",
  "properties": {
    "order": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order ID"
        },
        "items": {
          "type": "array",
          "description": "Product list",
          "items": {
            "type": "object",
            "properties": {
              "productName": {"type": "string"},
              "quantity": {"type": "number"},
              "price": {"type": "number"}
            }
          }
        },
        "totalAmount": {
          "type": "number",
          "description": "Total order amount"
        },
        "shippingAddress": {
          "type": "object",
          "properties": {
            "province": {"type": "string"},
            "city": {"type": "string"},
            "district": {"type": "string"},
            "detail": {"type": "string"}
          }
        }
      }
    },
    "customer": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "phone": {"type": "string"}
      }
    }
  }
}
```

#### Custom Labels (customLabels)

Provide custom display labels for fields.

**Field Properties**:
- Optional field
- Key-value pair format
- Used for frontend display, doesn't affect recognition results

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output an empty object when recognition result is empty.

**Default**: `false`

**Purpose**: Prevents workflow from terminating at this node.

#### Execute Once (executeOnce)

Whether to execute only once using the first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry when recognition fails.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### Error Handling (onError)

How to handle recognition failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue with regular output
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Extract contact info and requirements from customer message"
```

## Output Data

The output structure of the Entity Recognition node is determined by your defined JSON Schema.

```javascript
// Access extracted entities
$('Entity Recognition').name
$('Entity Recognition').phone
$('Entity Recognition').email

// Access nested objects
$('Entity Recognition').order.orderId
$('Entity Recognition').order.totalAmount

// Access arrays
$('Entity Recognition').order.items[0].productName
$('Entity Recognition').order.items.length

// Access address info
$('Entity Recognition').shippingAddress.city
$('Entity Recognition').shippingAddress.detail
```

## Workflow Examples

### Example 1: Customer Information Extraction

```
Chat Trigger
  → Entity Recognition Node
    Model: GPT-3.5-turbo
    Input: $('Chat Trigger').message
    Instructions: "Extract contact information from customer message"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "Customer name"},
          "phone": {"type": "string", "description": "Mobile number"},
          "email": {"type": "string", "description": "Email"},
          "company": {"type": "string", "description": "Company name"},
          "intent": {"type": "string", "description": "Inquiry intent"}
        }
      }
  → Conditional Branch
    → [Complete info] → HTTP Request (Create customer record) → Answer
    → [Incomplete info] → Answer (Request additional info)
```

### Example 2: Order Information Parsing

```
Webhook Trigger
  → Entity Recognition Node
    Model: GPT-4
    Input: $('Webhook Trigger').body.orderText
    Instructions: "Extract complete order info including items, quantities, prices, and shipping address"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "product": {"type": "string"},
                "quantity": {"type": "number"},
                "unitPrice": {"type": "number"}
              }
            }
          },
          "recipient": {"type": "string"},
          "phone": {"type": "string"},
          "address": {
            "type": "object",
            "properties": {
              "province": {"type": "string"},
              "city": {"type": "string"},
              "detail": {"type": "string"}
            }
          },
          "remarks": {"type": "string"}
        }
      }
  → Code Node (Calculate order total)
  → HTTP Request (Create order)
  → Answer Node
```

### Example 3: Resume Information Extraction

```
HTTP Request (Get resume text)
  → Entity Recognition Node
    Model: GPT-4
    Input: $('HTTP Request').body.resumeText
    Instructions: "Extract candidate's education, work experience, and skills"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "basicInfo": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "phone": {"type": "string"},
              "email": {"type": "string"},
              "birthYear": {"type": "number"}
            }
          },
          "education": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "school": {"type": "string"},
                "degree": {"type": "string"},
                "major": {"type": "string"},
                "graduationYear": {"type": "number"}
              }
            }
          },
          "workExperience": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "company": {"type": "string"},
                "position": {"type": "string"},
                "startDate": {"type": "string"},
                "endDate": {"type": "string"},
                "responsibilities": {"type": "string"}
              }
            }
          },
          "skills": {
            "type": "array",
            "items": {"type": "string"}
          }
        }
      }
  → HTTP Request (Store to recruitment system)
```

### Example 4: Smart Form Filling

```
Chat Trigger
  → Entity Recognition Node
    Model: GPT-3.5-turbo
    Input: $('Chat Trigger').conversationHistory
    Instructions: "Extract all required form information from conversation history"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "formData": {
            "type": "object",
            "properties": {
              "firstName": {"type": "string"},
              "lastName": {"type": "string"},
              "dateOfBirth": {"type": "string"},
              "nationality": {"type": "string"},
              "passportNumber": {"type": "string"},
              "travelDate": {"type": "string"},
              "destination": {"type": "string"},
              "purpose": {"type": "string"}
            }
          },
          "missingFields": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Fields that still need to be asked"
          }
        }
      }
  → Conditional Branch
    → [Form complete] → HTTP Request (Submit application) → Answer
    → [Info missing] → Answer (Ask for missing fields)
```

### Example 5: Invoice Information Extraction

```
Webhook Trigger (Receive invoice image)
  → LLM Node (OCR to extract invoice text)
  → Entity Recognition Node
    Model: GPT-4
    Input: $('LLM').ocrText
    Instructions: "Extract structured information from invoice text, date format YYYY-MM-DD"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "invoiceNumber": {"type": "string"},
          "invoiceDate": {"type": "string"},
          "sellerInfo": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "taxId": {"type": "string"},
              "address": {"type": "string"}
            }
          },
          "buyerInfo": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "taxId": {"type": "string"}
            }
          },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": {"type": "string"},
                "quantity": {"type": "number"},
                "unitPrice": {"type": "number"},
                "amount": {"type": "number"}
              }
            }
          },
          "totalAmount": {"type": "number"},
          "taxAmount": {"type": "number"}
        }
      }
  → HTTP Request (Store to financial system)
```

## Best Practices

### 1. Design Good JSON Schema

**Clear Field Descriptions**
```json
{
  "properties": {
    "phone": {
      "type": "string",
      "description": "Customer mobile number, 11 digits, format: 13812345678"
    },
    "amount": {
      "type": "number",
      "description": "Order amount in RMB, keep 2 decimal places"
    }
  }
}
```

**Use Appropriate Data Types**
```json
{
  "properties": {
    "quantity": {"type": "number"},        // Use number not string
    "isVip": {"type": "boolean"},          // Use boolean
    "tags": {
      "type": "array",
      "items": {"type": "string"}          // Specify array element type
    }
  }
}
```

**Mark Required Fields**
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "phone": {"type": "string"},
    "email": {"type": "string"}
  },
  "required": ["name", "phone"]            // Specify required fields
}
```

### 2. Provide Effective Instructions

**Include Context Information**
```javascript
// Good instructions
"This is a customer refund request, please extract order number, refund reason, and refund amount"

// Poor instructions
"Extract information"
```

**Explain Special Format Requirements**
```javascript
"Date format unified as YYYY-MM-DD, amount keeps 2 decimal places, phone number includes country code"
```

**Handle Ambiguous Cases**
```javascript
"If multiple addresses appear in text, prioritize extracting content marked as 'shipping address'; if not explicitly marked, extract the last appearing address"
```

### 3. Choose Model Reasonably

**Choose Based on Task Complexity**
```yaml
# Simple entity extraction - Use smaller model
model: GPT-3.5-turbo
Scenario: Extract clear fields like name, phone, email

# Complex structure extraction - Use powerful model
model: GPT-4
Scenario: Nested structures, requires context understanding, ambiguous info inference
```

**Balance Cost and Accuracy**
```yaml
# Cost-sensitive scenario
- Try GPT-3.5-turbo first
- Downgrade to rule extraction or manual processing on failure

# Accuracy-first scenario
- Use GPT-4 directly
- Enable retry mechanism
```

### 4. Handle Extraction Failures

**Validate Extraction Results**
```
Entity Recognition Node
  → Code Node (Validate extracted data completeness)
    Code:
      function main({entities}) {
          const required = ['name', 'phone', 'email']
          const missing = required.filter(field => !entities[field])

          return {
              isValid: missing.length === 0,
              missingFields: missing
          }
      }
  → Conditional Branch
    → [Valid] → Continue processing
    → [Invalid] → Request additional info
```

**Set Retry Strategy**
```yaml
settings:
  retryOnFail: true
  maxTries: 2                     # Moderate retry
  waitBetweenTries: 1000
```

### 5. Optimize Input Text

**Clean Redundant Information**
```javascript
// Use Code node to preprocess text
function main({rawText}) {
    // Remove extra whitespace
    const cleaned = rawText.replace(/\s+/g, ' ').trim()

    // Remove HTML tags
    const noHtml = cleaned.replace(/<[^>]*>/g, '')

    return {processedText: noHtml}
}
```

**Provide Structured Input**
```javascript
// When multiple sources exist, provide clear structure
`Customer Info:
Name: ${$('Form').name}
Phone: ${$('Form').phone}

Inquiry Content:
${$('Form').message}

History:
${$('Database').history}`
```

### 6. Handle Arrays and Nested Structures

**Access Array Elements**
```javascript
// Get first product
$('Entity Recognition').items[0].productName

// Iterate all products (in Code node)
$('Entity Recognition').items.map(item => item.productName).join(', ')

// Calculate total price
$('Entity Recognition').items.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

**Access Nested Objects**
```javascript
// Multi-level nested access
$('Entity Recognition').order.shippingAddress.city

// Use optional chaining (in Code node)
$('Entity Recognition').order?.shippingAddress?.city || 'Not provided'
```

## FAQ

### Q1: What's the difference between Entity Recognition node and LLM node?

**A**:
- **Entity Recognition Node**: Specifically for extracting structured data from text, output format strictly defined by JSON Schema
- **LLM Node**: General text generation, output is free-form text

**Usage Recommendation**:
- Need structured data extraction → Use Entity Recognition node
- Need text generation or conversation → Use LLM node

### Q2: What if recognition accuracy is low?

**A**: Methods to improve accuracy:

1. **Optimize JSON Schema descriptions**
   ```json
   {
     "phone": {
       "type": "string",
       "description": "China mainland mobile number, 11 digits, starts with 1"
     }
   }
   ```

2. **Provide more detailed instructions**
   ```javascript
   "This is a customer inquiry message, context: customer wants to know about product pricing and shipping"
   ```

3. **Use more powerful model** (like GPT-4)

4. **Preprocess input text** to remove interference

5. **Enable retry mechanism**

### Q3: How many fields can be extracted?

**A**: Theoretically no strict limit, but recommended:
- **Simple extraction**: 5-10 fields
- **Complex extraction**: No more than 20 fields
- **Nested structure**: Total levels no more than 3-4

Too many fields will:
- Increase API cost
- Decrease recognition accuracy
- Increase response time

**Solution**: Extract in multiple passes, each focusing on specific domain

### Q4: How to handle optional fields?

**A**: Don't include optional fields in the `required` array in JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},          // Required
    "phone": {"type": "string"},         // Required
    "email": {"type": "string"},         // Optional
    "company": {"type": "string"}        // Optional
  },
  "required": ["name", "phone"]
}
```

In extraction results, optional fields may not exist or be `null`.

### Q5: What if text doesn't contain certain fields?

**A**: The model will try to:
- Return `null` or empty value
- Not return the field (if it's optional)

**Handling Recommendation**:
```javascript
// Use conditional branch to check
$('Entity Recognition').email !== null && $('Entity Recognition').email !== ""

// Provide default value in Code node
function main({entities}) {
    return {
        email: entities.email || 'Not provided',
        phone: entities.phone || 'Not provided'
    }
}
```

### Q6: Which languages are supported?

**A**: Depends on selected model, mainstream models usually support:
- Chinese
- English
- Japanese
- Korean
- Various European languages

Multilingual mixed text can also be processed, but accuracy may be slightly lower.

### Q7: What's the cost of entity recognition?

**A**: Cost depends on:
- **Model Choice**: GPT-4 > Claude > GPT-3.5-turbo
- **Input Length**: Longer text costs more
- **Schema Complexity**: Complex schema may need more tokens

**Cost Optimization Tips**:
- Preprocess text to remove irrelevant content
- Use more cost-effective model (like GPT-3.5-turbo)
- Enable `executeOnce` to avoid repeated execution

### Q8: Can information be extracted from images or PDFs?

**A**: Entity Recognition node itself only processes text. To process images or PDFs:

```
1. Use OCR tool or multimodal LLM (like GPT-4 Vision) to extract text
2. Pass extracted text to Entity Recognition node
3. Entity Recognition node extracts structured info
```

**Workflow Example**:
```
Webhook Trigger (Receive image)
  → LLM Node (GPT-4 Vision, extract text)
  → Entity Recognition Node (Extract structured data)
  → Subsequent processing
```

## Next Steps

- [AI Classifier](/en/guide/workflow/nodes/action-nodes/ai-classifier) - Learn how to classify text
- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Learn how to generate AI responses
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Learn how to process extracted structured data

## Related Resources

- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Make conditional decisions based on extraction results
- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Send extracted data to external systems
- [Expression Syntax](/en/guide/expressions/) - Learn how to access extracted entity data
