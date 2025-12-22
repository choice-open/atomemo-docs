---
title: Keyboard Shortcuts
description: Complete reference of keyboard shortcuts for the flow editor
---

# Keyboard Shortcuts

Master the flow editor with these keyboard shortcuts to boost your productivity. All shortcuts are available in the flow editor canvas.

::: tip Platform Differences
- **Mac**: Use `⌘ Cmd` for shortcuts shown with `Ctrl/Cmd`
- **Windows/Linux**: Use `Ctrl` for shortcuts shown with `Ctrl/Cmd`
:::

## Essential Shortcuts

### Selection & Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Arrow Keys` | Navigate Nodes | Navigate between nodes using arrow keys (↑↓←→) |
| `Ctrl/Cmd + A` | Select All | Select all nodes in the canvas |
| `Escape` | Clear Selection | Deselect all selected nodes |
| `G` | Focus Selected | Center viewport on selected items |
| `F` | Fit View | Fit all nodes in viewport |

### Editing Operations

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Enter` | Edit Node | Enter edit mode for the selected node (single selection only) |
| `Delete` or `Backspace` | Delete | Delete selected nodes and groups |
| `Shift + Delete` | Smart Delete | Delete selected nodes and reconnect remaining connections |
| `D` | Toggle Activation | Toggle active/inactive state of selected nodes or groups |

### Copy & Paste

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + C` | Copy | Copy selected nodes or groups |
| `Ctrl/Cmd + V` | Paste | Paste copied nodes at cursor position |
| `Ctrl/Cmd + D` | Duplicate | Duplicate selected nodes or groups in place |

### Undo & Redo

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + Z` | Undo | Undo last action (up to 50 states) |
| `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z` | Redo | Redo previously undone action |

## Canvas Operations

### Viewport Control

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + =` or `Ctrl/Cmd + +` | Zoom In | Increase canvas zoom level |
| `Ctrl/Cmd + -` | Zoom Out | Decrease canvas zoom level |
| `Ctrl/Cmd + 0` | Reset Zoom | Reset zoom to 100% |
| `Space` (hold) | Pan Mode | Enter canvas pan mode - drag to move viewport |

### Layout & Organization

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + G` | Create Group | Group selected nodes together |
| `Shift + T` | Tidy Up | Smart layout organization - works on selection or all nodes |

## Interface Controls

### Panels & Dialogs

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + B` | Toggle Sidebar | Show/hide the right sidebar panel |
| `Ctrl/Cmd + L` | Toggle Logs Panel | Show/hide the logs panel at the bottom |
| `Tab` | Toggle Node Panel | Open/close the node list panel (when no node is being edited) |

## Import & Export

### Data Operations

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + E` | Export JSON | Download workflow as JSON file |
| `Ctrl/Cmd + Shift + C` | Copy JSON | Copy workflow JSON to clipboard |

::: tip Drag & Drop Import
You can also import workflows by dragging a JSON file directly onto the canvas!
:::

## Smart Features

### Arrow Key Navigation

The flow editor supports intelligent keyboard navigation using arrow keys:

- **Up/Down Arrows (↑/↓)**: Navigate vertically between nodes
  - Prioritizes vertically aligned nodes
  - Automatically finds the nearest node in the specified direction
  - Based on spatial positioning for intuitive navigation

- **Left/Right Arrows (←/→)**: Navigate horizontally between nodes
  - Follows workflow connections (DAG relationships) when available
  - Left: Navigate to connected parent nodes
  - Right: Navigate to connected child nodes
  - Falls back to spatial navigation if no connections exist

::: tip Smart Navigation
The navigation system uses a combination of workflow structure and spatial positioning to provide the most intuitive navigation experience. Nodes are organized in a grid and navigation considers both their logical connections and physical positions on the canvas.
:::

### Context-Aware Shortcuts

Some shortcuts behave differently based on your selection:

#### Smart Duplicate (`Ctrl/Cmd + D`)
- **Groups Selected**: Duplicates entire groups with all contained nodes
- **Nodes Selected**: Duplicates individual nodes
- Priority: Groups > Nodes

#### Smart Delete (`Shift + Delete`)
- Deletes selected nodes
- Automatically reconnects remaining nodes when possible
- Preserves workflow continuity

#### Node Insert/Remove from Edge (`Shift + Drag`)
- **Insert Node into Edge**: Hold `Shift` and drag a node onto a connection
  - The connection will highlight when hovered
  - Release mouse to insert the node into the connection
  - Example: A→C becomes A→B→C
  - Supports inserting multiple nodes as a chain (must form a complete chain)

- **Remove Node from Edge**: Hold `Shift` and drag an inserted node away
  - Connection breaks immediately when drag starts
  - Automatically creates bypass connection to maintain flow
  - Example: A→B→C becomes A→C
  - Supports removing multiple nodes as a chain (preserves internal connections)

::: tip Multi-Node Chain Rules
Selected multiple nodes must satisfy:
- Form a complete single chain (no branches, no cycles)
- Have exactly one start node and one end node
- Have only one external input and one external output connection
:::

#### Smart Toggle (`D`)
- **Groups Selected**: Toggles activation state of entire groups
- **Nodes Selected**: Toggles activation state of individual nodes
- Priority: Groups > Nodes

#### Smart Tidy (`Shift + T`)
- **Groups Selected**: Organizes selected groups
- **Multiple Nodes Selected**: Organizes selected nodes
- **Nothing/Single Node Selected**: Organizes entire canvas

## Tips & Best Practices

### Input Fields
::: warning
Keyboard shortcuts are automatically disabled when typing in:
- Text input fields
- Text areas
- Content-editable elements
- Code editors (CodeMirror)

This prevents accidental actions while editing text.
:::

### Readonly Mode
Most editing shortcuts are disabled in readonly mode, including:
- Delete operations
- Copy/paste operations
- Undo/redo
- Node creation and grouping
- Activation toggles

View and navigation shortcuts remain active.

### Workflow Tips

1. **Keyboard Navigation**: Use arrow keys to quickly navigate between nodes without reaching for your mouse
2. **Fast Node Editing**: Select a node and press `Enter` to quickly start editing
3. **Quick Cleanup**: Use `Shift + T` to automatically organize your canvas layout
4. **Efficient Copying**: Use `Ctrl/Cmd + D` instead of copy-paste for faster duplication
5. **Smart Deletion**: Use `Shift + Delete` to remove nodes while maintaining connections
6. **Focus Your Work**: Press `G` to quickly center on your selection
7. **Flexible Connections**: Use `Shift + Drag` to quickly insert or remove nodes without manual reconnection

## See Also

- [Working with Nodes](/en/guide/working-with-nodes) - Learn more about node operations
- [Editing Nodes](/en/guide/editing-nodes) - Deep dive into node editing
- [Version Control](/en/guide/workflow/version-control) - Manage workflow versions
