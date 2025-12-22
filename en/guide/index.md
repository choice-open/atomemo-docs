---
title: User Guide
description: Learn how to build AI Agents and automation workflows with {{PRODUCT_NAME}}
---

# User Guide

Welcome to the {{PRODUCT_NAME}} User Guide! This guide will help you quickly master the platform's core features, from creating your first AI Agent to building complex automation workflows.

## Quick Navigation

### Getting Started
- [Creating Apps](/en/guide/creating-apps) - Learn how to create and configure workflow applications
- [Working with Nodes](/en/guide/working-with-nodes) - Master the usage of various node types

### Workflow Building
- [Working with Nodes](/en/guide/working-with-nodes) - Master adding, connecting, and configuring nodes
- [Editing Nodes](/en/guide/editing-nodes) - Learn how to use the node editor
- [Expressions](/en/guide/expressions) - Learn data processing and transformation syntax
- [Version Control](/en/guide/workflow/version-control) - Manage workflow version history

#### Trigger Nodes
Entry points for workflows, defining when to start execution:
- [Chat Trigger](/en/guide/workflow/nodes/trigger-nodes/chat) - Trigger workflows through user conversations
- [Manual Trigger](/en/guide/workflow/nodes/trigger-nodes/manual) - Manually trigger workflow execution
- [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) - Trigger workflows via HTTP requests

#### Action Nodes
Execute specific operation tasks:
- [AI Agent](/en/guide/workflow/nodes/action-nodes/ai-agent) - Build intelligent AI agents that autonomously call tools
- [AI Classifier](/en/guide/workflow/nodes/action-nodes/ai-classifier) - Intelligently classify text using AI
- [Answer](/en/guide/workflow/nodes/action-nodes/answer) - Return response messages to users
- [Code](/en/guide/workflow/nodes/action-nodes/code) - Execute custom Python or JavaScript code
- [Entity Recognition](/en/guide/workflow/nodes/action-nodes/entity-recognition) - Extract structured information from text
- [HTTP Request](/en/guide/workflow/nodes/action-nodes/http-request) - Call external API endpoints
- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Execute different branches based on conditions
- [Knowledge Retrieval](/en/guide/workflow/nodes/action-nodes/knowledge-retrieval) - Retrieve relevant information from knowledge bases
- [LLM](/en/guide/workflow/nodes/action-nodes/llm) - Call large language models to generate text
- [Sentiment Analysis](/en/guide/workflow/nodes/action-nodes/sentiment-analysis) - Analyze emotional tone of text

#### Tool Nodes
Provide callable tool capabilities for AI Agents:
- [Code Tool](/en/guide/workflow/nodes/tool-nodes/code) - Provide code execution capability for AI Agents
- [Entity Recognition Tool](/en/guide/workflow/nodes/tool-nodes/entity-recognition) - Provide information extraction capability for AI Agents
- [HTTP Request Tool](/en/guide/workflow/nodes/tool-nodes/http-request) - Provide API calling capability for AI Agents

### AI Agent Development
- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Build intelligent conversations and task processing
- [Tool Nodes](/en/guide/workflow/nodes/tool-nodes/code) - Add custom capabilities to Agents

### Team Collaboration
- **Permission Management (In Development)** - Configure team member access rights

## Core Concepts

### Workflows
A workflow is an automated process composed of multiple nodes. Each workflow includes:
- **Triggers**: Define when the workflow starts
- **Nodes**: Execute specific operations
- **Connections**: Define data flow direction

### Nodes
Nodes are the basic building blocks of workflows, categorized as:
- **Trigger**: Start the workflow
- **Action**: Execute specific tasks
- **Transform**: Process data
- **Control**: Flow control

### Expressions
Expressions are used to dynamically access and process data:
```javascript
// Access data from previous node
$json.userId

// Access output from specific node
$node["Webhook"].json.email

// Use built-in functions
$now()
$randomInt(1, 100)
```

## Best Practices

### 1. Organize Nodes Properly
- Use clear node naming
- Add comments for complex logic
- Group related nodes together

### 2. Error Handling
- Add error catching nodes
- Configure retry strategies
- Log errors properly

### 3. Performance Optimization
- Avoid unnecessary node executions
- Use conditional branches to reduce computation
- Set reasonable timeout values

### 4. Security
- Use credential management for sensitive information
- Validate external input data
- Limit API call frequency

## Next Steps

- [Create Your First App](/en/guide/creating-apps)
- [Explore Node Types](/en/guide/working-with-nodes)
- [Learn Expression Syntax](/en/guide/expressions)
- [Check Out Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook)

## Need Help?

- Join our community discussions
- [Report Issues]({{GITHUB_REPO_URL}}/issues)
