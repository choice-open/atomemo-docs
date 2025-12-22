---
title: Group Node
description: Organize and manage workflow nodes using groups for better structure and clarity
---

# Group Node

The Group Node is a powerful organizational tool that allows you to group multiple workflow nodes together, making complex workflows easier to understand, manage, and maintain. Groups help visualize the logical structure of your workflow and improve workflow readability.

## Core Concepts

### What is a Group Node?

A Group Node is a visual container that can hold multiple workflow nodes. It provides:

- **Visual Organization** - Group related nodes together for better clarity
- **Logical Structure** - Represent functional modules or workflow sections
- **Content Documentation** - Add Markdown descriptions to explain group purpose
- **Bulk Operations** - Manage multiple nodes as a single unit

### When to Use Groups

Groups are particularly useful when:

- **Organizing Complex Workflows** - Break down large workflows into logical sections
- **Documenting Workflow Sections** - Add descriptions explaining what each section does
- **Managing Related Nodes** - Group nodes that work together to achieve a specific goal
- **Improving Readability** - Make workflows easier to understand at a glance

## Features

### Creating Groups

Groups can be created in several ways:

1. **Select Nodes and Create Group**
   - Select multiple nodes on the canvas
   - Right-click and choose "Create Group" or use keyboard shortcut
   - The selected nodes will be automatically added to the new group

2. **Manual Group Creation**
   - Use the group creation tool from the toolbar
   - Drag to define the group area
   - After creating an empty group, you can drag nodes into it

### Adding Nodes to Groups

**Drag Node into Group:**

- Click and drag a node, moving it into the group area
- When the node is completely inside the group area, it will automatically join the group
- After adding nodes, you can use the "Tidy Up" feature to automatically adjust the group size and node layout

### Removing Nodes from Groups

**Drag Node out of Group:**

- Click and drag a node inside a group, moving it outside the group area
- When the node is completely outside the group area, it will automatically be removed from the group
- After removing nodes, you can use the "Tidy Up" feature to automatically adjust the group size

### Group Content (Markdown Editor)

Groups support rich text content using Markdown:

- **Double-click** on a group to open the Markdown editor
- Add descriptions, notes, or documentation
- Use Markdown syntax for formatting:
  - Headers (`#`, `##`, `###`)
  - **Bold** and *italic* text
  - Lists (ordered and unordered)
  - Links and code blocks

**Example Group Content:**

```markdown
# User Authentication Flow

This group handles all user authentication logic:
- Validate credentials
- Generate JWT tokens
- Handle refresh tokens
```

### Group Appearance

Groups support customizable appearance:

- **Color Coding** - Choose from predefined colors to visually distinguish groups
- **Semi-transparent Background** - Groups have a semi-transparent colored background that allows you to see nodes through the group
- **Resizable** - Adjust group size to fit content
- **Non-intrusive** - Groups are positioned behind nodes so they don't interfere with node interactions

### Group Operations

Groups support various operations:

#### Activate/Deactivate Group Nodes

- Toggle activation for all nodes within a group simultaneously
- Useful for temporarily disabling entire workflow sections
- The toolbar shows activation status based on group nodes

#### Copy and Duplicate

- **Copy** - Copy the entire group with all its nodes and connections
- **Duplicate** - Create a duplicate of the group at a new location
- Keyboard shortcuts: `Cmd/Ctrl+C` (copy), `Cmd/Ctrl+D` (duplicate)

#### Delete Group

- Remove the group container (nodes remain on canvas)
- Or remove group and all its nodes
- Keyboard shortcut: `Delete`

#### Tidy Up Group

- Automatically reorganize nodes within a group
- Optimize layout for better readability
- Keyboard shortcut: `Shift+T`

### Group Toolbar

When hovering over a group, a toolbar appears with quick actions:

- **Run** - Execute all nodes in the group (if all are active)
- **Delete** - Remove the group
- **Activate/Deactivate** - Toggle activation for group nodes
- **More Menu** - Access additional options:
  - Change group color
  - Copy group
  - Duplicate group
  - Tidy up nodes
  - Delete group

### Context Menu

Right-click on a group to access the context menu:

- **Change Color** - Select a color for the group
- **Activate/Deactivate** - Toggle activation status
- **Paste** - Paste nodes into the group
- **Duplicate** - Duplicate the group
- **Tidy Up** - Reorganize nodes within the group
- **Delete** - Remove the group

## Best Practices

### Group Naming and Documentation

- **Use Descriptive Content** - Add clear Markdown descriptions explaining the group's purpose
- **Document Workflow Sections** - Use groups to document different phases of your workflow
- **Keep Groups Focused** - Each group should represent a single logical unit or function

### Group Organization

- **Logical Grouping** - Group nodes that work together to achieve a specific goal
- **Avoid Over-nesting** - Don't create groups within groups unnecessarily
- **Consistent Color Coding** - Use colors consistently to represent similar types of groups

### Workflow Structure

- **Start with Triggers** - Keep trigger nodes outside of groups for clarity
- **Group by Function** - Group nodes by their functional purpose
- **Document Complex Logic** - Use group content to explain complex workflow sections

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Create Group | Select nodes → Right-click → Create Group |
| Edit Group Content | Double-click on group |
| Copy Group | `Cmd/Ctrl+C` |
| Duplicate Group | `Cmd/Ctrl+D` |
| Delete Group | `Delete` |
| Tidy Up Group | `Shift+T` |

## Examples

### Example 1: Authentication Flow

**Group Structure:**

- **Group Name**: User Authentication Flow
- **Nodes Inside**:
  - Validate Credentials → Generate Token

**Group Content:**

```markdown
# User Authentication

Handles user login and token generation
```

**Visual Representation:**

```text
[User Authentication Flow]
    ├─ Validate Credentials
    └─ Generate Token
```

### Example 2: Data Processing Pipeline

**Group Structure:**

- **Group Name**: Data Processing Pipeline
- **Nodes Inside**:
  - Fetch → Transform → Store

**Visual Representation:**

```text
[Data Processing Pipeline]
    ├─ Fetch
    ├─ Transform
    └─ Store
```

## Limitations

- Groups are visual organizational tools and don't affect workflow execution
- Nodes within a group still execute according to their connections
- Groups cannot contain other groups (no nesting)
- Group boundaries are visual guides and don't restrict node placement

## Tips

- Use groups to document your workflow logic
- Color-code groups by function or importance
- Keep group sizes reasonable - too large groups become hard to manage
- Update group content as your workflow evolves
- Use "Tidy Up" to automatically organize nodes within groups
