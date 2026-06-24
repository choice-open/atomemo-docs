---
title: Form Trigger
description: Trigger workflow execution when a user submits a form, with customizable fields and responses
---

# Form Trigger

The Form Trigger creates a user-facing form that triggers workflow execution upon submission. Use it to collect structured data from users — such as feedback, support requests, or registrations — and process it automatically through your workflow.

## Use Cases

### Typical Applications
- **Feedback Collection** - Gather user feedback or surveys and process responses
- **Support Ticketing** - Let users submit support requests with structured information
- **Registration Forms** - Collect sign-up data and trigger onboarding workflows
- **Order Intake** - Accept order or booking requests via custom forms
- **Data Enrichment** - Collect additional user information for downstream processing
- **Lead Generation** - Capture leads and route them to your CRM

## Node Features

### Basic Characteristics
- **User-Facing Form** - Generates a unique URL where users can fill in and submit the form
- **Customizable Fields** - Define form fields with labels, types, and validation rules
- **Flexible Responses** - Configure what users see after submission (text message or redirect)
- **Test & Production URLs** - Separate URLs for development and live use
- **Branding Control** - Option to show or hide your branding on the form

### Built-in Output Fields

After form submission, access field values via the node name:

```javascript
$('Form Trigger').fieldName    // Access a field by its variable name
$('Form Trigger').email        // Example: user's email input
$('Form Trigger').feedback     // Example: user's feedback text
```

## Node Configuration

### Basic Settings (Parameters Panel)

#### Form URLs

After configuring the trigger, the system generates two form URLs:

**Test URL**
```
https://your-domain.com/forms/test/{app-id}/{trigger-id}
```
Used during development. Submit test forms and view execution results in the editor.

**Production URL**
```
https://your-domain.com/forms/{app-id}/{trigger-id}
```
Used in production after publishing. Share this URL with end users.

> **Tip**: Click the copy button next to the URL to copy it.

#### Form Title

A heading displayed at the top of the form.

```yaml
formTitle: "Customer Feedback"
```

- Optional — leave blank for no title
- Keep it concise and clear

#### Form Description

Supporting text shown below the title, explaining the form's purpose.

```yaml
formDescription: "Tell us about your experience so we can improve."
```

- Optional — supports multi-line text
- Use to provide instructions or context

#### Form Fields

Define the input fields users will fill in. Click **Add Form Field** to create one, then configure:

| Property | Description | Values |
| --- | --- | --- |
| **Label** | Display name for the field | e.g., "Your Email" |
| **Variable** | Name used to access the value in expressions | e.g., `email` |
| **Type** | Input data type (see below) | `string`, `number`, `file`, `array[file]`, `date`, `single_select`, `multiple_select` |
| **Required** | Whether the field must be filled in | `true` / `false` |
| **Max Length** | Max character count (`string`) or max file count (`array[file]`) | Default: 40 |
| **Hidden** | Hide the field from the form | `true` / `false` |

#### Field Types

| Type | UI Label | Description | Output Value | Extra Properties |
| --- | --- | --- | --- | --- |
| `string` | Text | Single-line text input | `string` | `maxLength` (max characters) |
| `number` | Number | Numeric input | `number` | — |
| `date` | Date | Date picker | `string` (ISO date) | — |
| `file` | Single File | Single file upload | `FileRef` (object) | `fileTypes`, `fileExtensions`, `fileUploadMethods` |
| `array[file]` | File List | Multiple file upload | `FileRef[]` (array) | `fileTypes`, `fileExtensions`, `fileUploadMethods`, `maxLength` (max file count) |
| `single_select` | Single Select | Dropdown — pick one option | `string` | `options` (array of option labels, **required**) |
| `multiple_select` | Multiple Select | Dropdown — pick multiple options | `string[]` | `options` (array of option labels, **required**) |

**File Upload Properties**:

| Property | Description | Values |
| --- | --- | --- |
| `fileTypes` | Allowed file categories | `document`, `image`, `custom` |
| `fileExtensions` | Custom file extensions (when `fileTypes` includes `custom`) | e.g., `[".pdf", ".csv"]` |
| `fileUploadMethods` | How users can upload files | `local_file` (from device), `remote_url` (from URL) |

**Example Field Configuration**:

```yaml
formFields:
  - label: "Your Name"
    variable: "name"
    type: "string"
    required: true
    maxLength: 50
  - label: "Email Address"
    variable: "email"
    type: "string"
    required: true
    maxLength: 100
  - label: "Your Rating (1-5)"
    variable: "rating"
    type: "number"
    required: false
  - label: "Additional Comments"
    variable: "comments"
    type: "string"
    required: false
    maxLength: 500
```

> **Note**: Field labels and variable names must be unique within the form. Duplicates are not allowed.

#### Submit Button Label

The text shown on the form's submit button.

```yaml
submitButtonLabel: "Send Feedback"
```

- Default: `"Submit"` (EN) / `"提交"` (CN)
- Customize to match your use case (e.g., "Register", "Send", "Book Now")

#### Show Branding

Toggle whether your {{PRODUCT_NAME}} branding appears on the form.

```yaml
showBranding: true   # Show branding (default)
showBranding: false  # Hide branding
```

- When enabled, a "Powered by" badge links to your homepage
- Disable for a white-label experience

#### Response Mode

Controls **when** the user sees the response after submitting:

| Mode | Behavior |
| --- | --- |
| `lastNode` | Wait for the entire workflow to finish, then show the response (default) |
| `onReceived` | Show the response immediately upon receiving the submission |

```yaml
responseMode: "lastNode"    # Default — wait for workflow to complete
responseMode: "onReceived"  # Immediate response, workflow runs in background
```

**When to use each**:
- `lastNode` — when you want to show workflow results (e.g., "Your order is confirmed, ID: #12345")
- `onReceived` — for quick acknowledgment when the workflow takes time (e.g., "We received your request, we'll get back to you")

#### Response Content

Choose what the user sees after submission:

**Text Response** (default):

```yaml
respondWith:
  type: "text"
  text: "Thank you! Your feedback has been recorded."
```

- Default: `"Your response has been recorded"` (EN) / `"您的反馈已被记录"` (CN)
- Supports multi-line text

**Redirect URL**:

```yaml
respondWith:
  type: "redirect"
  url: "https://example.com/thank-you"
```

- Must be a valid HTTP/HTTPS URL
- User is redirected after form submission

### Advanced Settings (Settings Panel)

#### Node Description

Add a description to help team members identify the form's purpose.

## Testing & Debugging

### Listen for Test Events

1. Click **Listen for Test Event** in the left panel
2. A test form opens in a new browser tab
3. Fill in and submit the test form
4. The workflow executes and displays results in the editor
5. Click **Stop Listening** to stop receiving test submissions

> **Tip**: After you finish building, use the production URL to share the form without needing to click "Listen" — the workflow runs automatically on every submission.

### Testing Manually

1. Open the test URL in your browser
2. Fill in the form fields
3. Submit the form
4. Check execution results in the editor

## Data Access

### Accessing Form Data

Form field values are accessible in subsequent nodes via `$('Node Name').variableName`:

```javascript
// Access individual fields
$('Form Trigger').name
$('Form Trigger').email
$('Form Trigger').rating

// Use in Code Node
const name = $('Form Trigger').name;
const email = $('Form Trigger').email;
return {
  greeting: `Hello, ${name}!`,
  recipient: email
};
```

## Workflow Examples

### Example 1: Simple Feedback Form

```
Form Trigger
  Form Title: "Share Your Feedback"
  Fields:
    - Name (string, required)
    - Rating (number, 1-5)
    - Comments (string)
  → HTTP Request Node
    URL: "https://api.example.com/feedback"
    Method: POST
    Body: {
      name: $('Form Trigger').name,
      rating: $('Form Trigger').rating,
      comments: $('Form Trigger').comments
    }
```

### Example 2: Support Ticket with AI

```
Form Trigger
  Form Title: "Submit a Support Request"
  Fields:
    - Name (string, required)
    - Email (string, required)
    - Issue (string, required)
    - Priority (number, 1-3)
  → AI Classifier Node
    Input: $('Form Trigger').issue
    Classes: ["Bug", "Feature Request", "Question", "Other"]
  → HTTP Request Node (create ticket)
    URL: "https://api.example.com/tickets"
    Method: POST
    Body: {
      name: $('Form Trigger').name,
      email: $('Form Trigger').email,
      issue: $('Form Trigger').issue,
      priority: $('Form Trigger').priority,
      category: $('AI Classifier').class
    }
```

### Example 3: Registration with Redirect

```
Form Trigger
  Form Title: "Event Registration"
  Fields:
    - Name (string, required)
    - Email (string, required)
    - Company (string)
  Response Mode: lastNode
  Respond With: Redirect URL "https://example.com/registered"
  → Code Node
    Code: |
      return {
        name: $('Form Trigger').name,
        email: $('Form Trigger').email,
        company: $('Form Trigger').company
      };
  → HTTP Request Node (register)
    URL: "https://api.example.com/events/register"
    Method: POST
    Body: $('Code').output
  → Answer Node
    Answer: "Registration confirmed. Redirecting..."
```

## Best Practices

### 1. Rename the Node

Double-click the node title to rename it from the generic "On form submission" to something meaningful:

```
# Bad — unclear purpose
[On form submission]

# Good — immediately obvious
[Customer Feedback Form]
```

### 2. Keep Forms Concise

Only ask for essential information:

```yaml
# Good — focused, 3-4 relevant fields
formFields:
  - {label: "Name", variable: "name", required: true}
  - {label: "Email", variable: "email", required: true}
  - {label: "Message", variable: "message", required: true}

# Bad — too many fields, users may abandon
formFields:
  - # 12 fields including non-essential details...
```

### 3. Use Meaningful Variable Names

```yaml
# Good — descriptive and self-documenting
variable: "customerEmail"

# Bad — cryptic
variable: "f1"
```

### 4. Choose the Right Response Mode

- **Quick acknowledgment**: Use `onReceived` to immediately confirm receipt
- **Show results**: Use `lastNode` when you need workflow output in the response

### 5. Validate Data in the Workflow

Even with form-level required fields, add validation in your workflow:

```javascript
// Code Node — additional validation
const email = $('Form Trigger').email;
const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

if (!isValid) {
  throw new Error("Invalid email address");
}

return { email };
```

## FAQ

### Q: How many Form Triggers can a workflow have?

**A**: There is no fixed limit. However, keep in mind that each Form Trigger generates its own URL, and a workflow with multiple forms should be logically coherent.

### Q: Can I style the form?

**A**: The form uses a built-in template. You can customize the title, description, button label, and toggle the branding badge. Advanced CSS customization is not available.

### Q: What happens if a required field is empty?

**A**: The form validates required fields on the client side before submission. The user sees an inline error and cannot submit until all required fields are filled.

### Q: How are form submissions secured?

**A**: Form URLs use HTTPS. For additional security, consider:
- Adding a CAPTCHA step (via a separate workflow call)
- Implementing rate limiting at the gateway level
- Validating all input data in your workflow

### Q: Can I embed the form on my website?

**A**: The form is accessed via its unique URL. You can link to it or embed it via an `<iframe>` on your site.

### Q: Form Trigger vs Webhook Trigger for data collection?

**A**:

| Feature | Form Trigger | Webhook Trigger |
| --- | --- | --- |
| Setup | No-code form builder | Requires HTTP client |
| End User | Non-technical users | Developers / APIs |
| URL | Auto-generated form page | API endpoint |
| Validation | Built-in field validation | Manual in workflow |
| Response | Text or redirect | HTTP response body |

**Recommendation**: Use Form Trigger for human-facing data collection. Use Webhook Trigger for system-to-system integrations.

## Next Steps

- [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) - Learn about HTTP-based triggering
- [AI Classifier Node](/en/guide/workflow/nodes/action-nodes/ai-classifier) - Classify form submissions
- [Working with Nodes](/en/guide/working-with-nodes) - Learn workflow design fundamentals

## Related Resources

- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Send form data to external APIs
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Add custom logic to process submissions
- [Schedule Trigger](/en/guide/workflow/nodes/trigger-nodes/schedule) - Trigger workflows on a schedule
