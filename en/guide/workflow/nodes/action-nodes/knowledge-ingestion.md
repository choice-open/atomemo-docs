---
title: Knowledge Ingestion Node
description: Store documents and files into knowledge bases for subsequent knowledge retrieval
---

# Knowledge Ingestion Node

The Knowledge Ingestion node is used to store documents and files into knowledge bases, making them searchable and usable by knowledge retrieval nodes. It is one of the core nodes for building knowledge base systems, and when used together with knowledge retrieval nodes, can build complete RAG (Retrieval-Augmented Generation) systems.

## Use Cases

### Typical Applications
- **Document Import** - Batch import product manuals, technical documentation, etc. into knowledge bases
- **Knowledge Updates** - Regularly update knowledge base content to keep information current
- **User Uploads** - Process user-uploaded documents and store them in knowledge bases
- **Automated Knowledge Management** - Automatically collect and store knowledge from multiple sources
- **Document Preprocessing** - Extract entity information from documents and store
- **Image Extraction** - Extract images from documents and store

## Node Configuration

### Basic Settings (Parameters Panel)

#### Files (files)

Files to store in the knowledge base.

**Field Properties**:
- Required field
- Supports expressions
- Can reference file references in workflow

**Configuration Examples**:

```javascript
// 1. Reference files from file upload node
$('File Upload').files

// 2. Reference files received from Webhook
$('Webhook Trigger').files

// 3. Dynamically select files using expressions
$('HTTP Request').body.fileUrl

// 4. Reference files processed by code node
$('Code').processedFiles
```

**Supported File Formats**:
- PDF documents
- Word documents (.docx)
- Markdown files (.md)
- Text files (.txt)
- Other supported document formats

#### Knowledge Base (knowledgeBaseId)

Select the target knowledge base to store files.

**Field Properties**:
- Required field
- Select from created knowledge bases
- Does not support expressions (static selection)

**Configuration Examples**:

```yaml
Knowledge Base: "kb_product_manual_2024"
```

**Notes**:
- Ensure knowledge base is created
- Files will be stored in specified knowledge base
- View stored files in knowledge base management page

#### Entity Types (entityTypes)

Specify entity types to extract from documents.

**Field Properties**:
- Optional field
- Array type
- Used for structured information extraction

**Configuration Examples**:

```javascript
// Extract product-related entities
entityTypes: ["product", "price", "specification"]

// Extract person and location entities
entityTypes: ["person", "location", "organization"]

// Extract technology-related entities
entityTypes: ["technology", "version", "api"]
```

**Purpose**:
- Extract structured information from documents
- Enhance semantic understanding during retrieval
- Support entity-level retrieval

#### Extract Images (extractImages)

Whether to extract and store images from documents.

**Field Properties**:
- Boolean
- Default: `false`

**Description**:
- When enabled, images in documents will be extracted and stored
- Images can be used for subsequent retrieval and display
- Suitable for documents containing charts, screenshots

**Configuration Examples**:

```yaml
extractImages: true  # Extract images
extractImages: false # Don't extract images (default)
```

### Advanced Settings (Settings Panel)

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Store product manual in knowledge base"
```

## Output Data

The Knowledge Ingestion node returns the result of the storage operation.

**Output Structure**:

```javascript
{
  success: true,              // Whether successful
  knowledgeBaseId: "kb_xxx",  // Knowledge base ID
  fileCount: 5,               // Number of files stored
  entityCount: 120,           // Number of entities extracted (if entity extraction enabled)
  message: "Storage successful" // Operation message
}
```

**Access Output**:

```javascript
// Check if successful
$('Knowledge Ingestion').success

// Get knowledge base ID
$('Knowledge Ingestion').knowledgeBaseId

// Get file count
$('Knowledge Ingestion').fileCount

// Get entity count
$('Knowledge Ingestion').entityCount
```

## Workflow Examples

### Example 1: Batch Document Import

```
File Upload Node
  → Knowledge Ingestion Node
    Files: $('File Upload').files
    Knowledge Base: "kb_company_docs"
    Entity Types: ["document", "section", "keyword"]
    Extract Images: true
  → Notification Node
    Send import success notification
```

### Example 2: User Upload Document Processing

```
Webhook Trigger (receive file upload)
  → Code Node (validate files)
    Code: |
      function main({files}) {
        // Validate file type and size
        const allowedTypes = ['pdf', 'docx', 'txt'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        const validFiles = files.filter(f => {
          const ext = f.name.split('.').pop().toLowerCase();
          return allowedTypes.includes(ext) && f.size <= maxSize;
        });
        
        return {
          validFiles,
          count: validFiles.length
        };
      }
  → Conditional Branch
    Condition: $('Code').count > 0
    → [True] → Knowledge Ingestion Node
      Files: $('Code').validFiles
      Knowledge Base: "kb_user_uploads"
      → Answer Node
        Answer: "Documents successfully uploaded and stored"
    → [False] → Answer Node
      Answer: "File format not supported or file too large"
```

### Example 3: Regular Knowledge Base Updates

```
Schedule Trigger (daily execution)
  → HTTP Request Node
    URL: "https://api.example.com/docs/latest"
    Get latest document list
  → Code Node
    Code: |
      function main({response}) {
        // Filter documents that need updating
        const newDocs = response.documents.filter(doc => {
          return doc.updatedAt > getLastUpdateTime();
        });
        
        return {
          files: newDocs.map(doc => doc.fileUrl),
          count: newDocs.length
        };
      }
  → Conditional Branch
    Condition: $('Code').count > 0
    → [True] → HTTP Request Node (download files)
      → Knowledge Ingestion Node
        Files: $('HTTP Request').files
        Knowledge Base: "kb_product_docs"
        Entity Types: ["product", "feature", "specification"]
      → Notification Node
        Notification: `Updated ${$('Code').count} documents`
```

## Best Practices

### 1. Reasonably Select Knowledge Bases

**Categorize by Topic**:
```yaml
kb_product_catalog: Product catalog
kb_technical_docs: Technical documentation
kb_faq: Frequently asked questions
kb_user_guides: User guides
```

**Categorize by Source**:
```yaml
kb_internal_docs: Internal documents
kb_external_resources: External resources
kb_user_uploads: User uploads
```

### 2. Configure Entity Types

**Select entities based on document type**:
```javascript
// Product documents
entityTypes: ["product", "price", "specification", "feature"]

// Technical documents
entityTypes: ["technology", "api", "version", "parameter"]

// General documents
entityTypes: ["document", "section", "keyword"]
```

### 3. File Preprocessing

**Validate Files**:
```javascript
// Validate files in code node
function main({files}) {
  const validFiles = files.filter(file => {
    // Check file type
    const ext = file.name.split('.').pop();
    const allowedTypes = ['pdf', 'docx', 'txt', 'md'];
    
    // Check file size (e.g., 10MB)
    const maxSize = 10 * 1024 * 1024;
    
    return allowedTypes.includes(ext) && file.size <= maxSize;
  });
  
  return {validFiles};
}
```

### 4. Handle Storage Results

**Check Storage Status**:
```javascript
Conditional Branch:
  Condition: $('Knowledge Ingestion').success === true
  → [True] → Notify success
  → [False] → Handle error
```

## FAQ

### Q1: What file formats are supported?

**A**: Supports common document formats:
- PDF (.pdf)
- Word documents (.docx)
- Markdown (.md)
- Text files (.txt)
- Other system-supported formats

Specific supported formats may vary by system configuration.

### Q2: Are there file size limits?

**A**: Usually there are file size limits, recommended:
- Single file not exceeding 10-50MB (depends on system configuration)
- Large files can be split into multiple smaller files
- Pay attention to total size limit when batch uploading

### Q3: What are entity types?

**A**: Entity types are used to extract structured information from documents:

```javascript
// For example, extract from product documents
entityTypes: ["product", "price", "specification"]

// Extracted results can be used during retrieval
// Improve retrieval accuracy and relevance
```

### Q4: How to know if storage succeeded?

**A**: Check output data:

```javascript
// Check success status
$('Knowledge Ingestion').success === true

// Get file count
$('Knowledge Ingestion').fileCount

// Get operation message
$('Knowledge Ingestion').message
```

### Q5: Can images be stored?

**A**: Yes, enable `extractImages` option:

```yaml
Extract Images: true
```

System will extract images from documents and store them, images can be used during retrieval.

### Q6: How long until stored documents can be retrieved?

**A**: Usually can be retrieved immediately after storage, but processing time depends on:
- File size and quantity
- Whether entity extraction is enabled
- Whether image extraction is enabled
- System load conditions

### Q7: How to update already stored documents?

**A**: 
1. Delete old documents (if needed)
2. Re-upload updated documents
3. System will automatically process new version

### Q8: Can batch storage be performed?

**A**: Yes, can pass multiple files at once:

```javascript
// Reference multiple files
$('File Upload').files  // Array format

// Knowledge Ingestion node will process all files
```

## Next Steps

- [Knowledge Retrieval Node](/en/guide/workflow/nodes/action-nodes/knowledge-retrieval) - Retrieve stored knowledge
- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Build intelligent assistants using knowledge bases
- [File Upload Node](/en/guide/workflow/nodes/action-nodes/file-upload) - Get files to store

## Related Resources

- [Knowledge Retrieval Node](/en/guide/workflow/nodes/action-nodes/knowledge-retrieval) - Learn how to retrieve stored knowledge
- [RAG System Building](/en/guide/workflow/rag-system) - Learn to build complete RAG systems
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in configuration

