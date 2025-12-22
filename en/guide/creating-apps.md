---
title: Creating Apps
description: Learn how to create and manage workflow apps in {{PRODUCT_NAME}}
---

# Creating Apps

Apps are the core units of workflows in {{PRODUCT_NAME}}. Each app contains a complete workflow designed to automate specific business processes or tasks.

## App Types

{{PRODUCT_NAME}} supports two types of apps:

### 1. Standalone Apps

Standalone apps are created directly in the Workspace and don't belong to any project.

**Use Cases**:
- Quick testing and prototyping
- Simple single-purpose automation
- Personal use workflows
- Tasks that don't require collaboration with other apps

**Characteristics**:
- Independent management, not constrained by projects
- Quick creation, simple configuration
- Suitable for lightweight automation needs

### 2. Project Apps

Project apps are created within a Project and share organizational structure with other apps in the same project.

**Use Cases**:
- Complex business process automation
- Multiple apps working together
- Team collaboration workflows
- App collections requiring unified management

**Characteristics**:
- Organized management, easy to maintain
- Support data sharing between apps
- Suitable for enterprise-level automation solutions

## Creating Standalone Apps

### Create from Workspace

1. **Open Workspace**
   - Click "Workspace" in the left navigation or visit `/workspace`

2. **Click "New App" Button**
   - Find the "New App" button at the top of the workspace page
   - Or click "New App" on the empty state page

3. **Immediately Enter Editor**
   - System automatically creates app and navigates to editor
   - App uses preset name (e.g., "Untitled App")
   - Description is empty
   - Icon and color are randomly generated
   - Start building your workflow directly

4. **Customize App Information** (Optional)
   - Return to Workspace
   - Right-click on app card
   - Select "Edit" or "Settings"
   - Modify app name (max 64 characters)
   - Add description (max 512 characters)
   - Change icon and color

**Features**:
- **Quick Start**: No need to fill forms, start building immediately
- **Random Appearance**: Each creation has different icon and color
- **Modify Later**: All information can be modified anytime in editor

## Creating Project Apps

### Step 1: Create or Select Project

First, you need a project:

**Create New Project**:

1. Click "New Project" button on the workspace page
2. Fill in project information:
   - **Project Name**: Enter project name (required, max 128 characters)
   - **Project Description**: Add project description (optional, max 1024 characters)
   - **Icon**: Select project icon
   - **Color**: Choose project theme color
3. Click "Create Project" button
4. System automatically navigates to project page

**Example**:
```
Project Name: "Customer Service System"
Description: "Collection of customer service related automation workflows"
Icon: Headset
Color: Purple
```

### Step 2: Create App in Project

1. **Enter Project Page**
   - Click project card in workspace
   - Or visit `/projects/{projectId}`

2. **Click "New App" Button**
   - Find "New App" button at the top of project page

3. **Immediately Enter Editor**
   - System automatically creates app and navigates to editor
   - App uses preset name
   - Description is empty
   - Icon and color are randomly generated
   - App is automatically associated with current project

4. **Start Building Workflow**
   - Add nodes and configure workflow
   - Modify app name and description anytime

## App Editor

After creating an app, you'll enter the app editor page. This is the main interface for building workflows.

### Editor Components

1. **Canvas Area** (Center)
   - Visual node editing area
   - Drag nodes to build workflow
   - Connect nodes to define data flow

2. **Node Panel** (Left)
   - Trigger nodes
   - Action nodes
   - Tool nodes
   - Drag to canvas to add nodes

3. **Node Configuration Panel** (Right)
   - Displays when node is selected
   - Configure node parameters
   - Use expressions to process data

4. **Top Toolbar**
   - App settings
   - Save workflow
   - Test run
   - View execution history

### Your First Workflow

After creating an app, you need to:

1. **Add Trigger Node**
   - Drag trigger node from left panel
   - Select trigger type (Chat, Manual, Webhook)
   - Configure trigger conditions

2. **Add Action Node**
   - Drag Action node to canvas
   - Connect trigger and Action node
   - Configure node parameters

3. **Test Workflow**
   - Click "Test" button at top
   - View execution results
   - Debug and optimize workflow

## App Configuration

### Basic Information

Modify app information in Workspace:

1. Return to Workspace
2. Find the app card
3. Right-click on app card
4. Select "Edit" or "Settings"
5. Modify in the dialog:
   - Name
   - Description
   - Icon and color

### App Settings

**Execution Settings**:
- **Timeout**: Set maximum workflow execution time
- **Retry Strategy**: Configure retry count on failure
- **Error Handling**: Choose error handling method (stop/continue/retry)

**Environment Variables**:
- Define variables used in workflow
- Support configurations for different environments (dev/production)

## App Management

### Move App

Move apps between standalone and project apps:

1. Find app in app list
2. Right-click app card
3. Select "Move to..."
4. Choose target project or "Standalone"

### Duplicate App

Quickly create app copy:

1. Right-click app card
2. Select "Duplicate"
3. Enter new app name
4. Choose target location (project or workspace)

### Delete App

Permanently delete app:

1. Right-click app card
2. Select "Delete"
3. Confirm deletion
4. App and all its data will be deleted

**Warning**: Deletion cannot be undone, please proceed with caution.

## Workspace Management

### Workspace View

Workspace displays all projects and standalone apps:

**View Options**:
- **Card View**: Display all projects and apps as cards
- **Search**: Search by name or description
- **Sort**: Sort by update time, creation time, name
- **Filter**: Filter by status, tags, type

### Search and Filter

**Search**:
```
Enter keywords in search box:
- App name
- App description
- Project name
```

**Sort Options**:
- Recently Updated
- Earliest Created
- Name A-Z
- Name Z-A

### Project View

Click project card to enter project view:

**Display Content**:
- Project basic information
- All apps under project
- Project statistics

**Operations**:
- Create new app
- Edit project information
- Delete project

## Best Practices

### 1. Proper Naming

**App Naming**:
```
Good naming:
✓ "Customer Message Auto Classifier"
✓ "Order Status Sync"
✓ "Daily Data Report"

Bad naming:
✗ "Test1"
✗ "New App"
✗ "Untitled"
```

**Project Naming**:
```
✓ "Customer Service System"
✓ "Order Processing Flow"
✓ "Data Analysis Tools"
```

### 2. Use Descriptions

Add clear descriptions for apps and projects:

```
App Description Example:
"Automatically receives customer messages, uses AI classifier
to identify intent, and forwards to corresponding team based
on classification"

Project Description Example:
"Collection of customer service related automation workflows,
including message processing, ticket management, satisfaction
surveys, etc."
```

### 3. Organization Structure

**Use projects to organize related apps**:
```
Customer Service System/
├── Message Reception and Classification
├── Auto Ticket Creation
├── Customer Satisfaction Survey
└── Service Quality Report

Order Processing Flow/
├── Order Status Sync
├── Inventory Management
├── Shipping Notification
└── Refund Processing
```

### 4. Appearance Design

Choose appropriate icons and colors:

**Icon Selection**:
- Reflects app functionality
- Easy to identify
- Maintains consistency

**Color Usage**:
- Use same or similar colors under same project
- Use different colors to distinguish different functions
- Consider readability and aesthetics

### 5. Progressive Development

**Start Simple**:
1. Create basic workflow
2. Test core functionality
3. Gradually add complex logic
4. Optimize performance and error handling

**Version Management**:
- Regularly save work progress
- Test before deploying to production
- Keep workflow version history

## FAQ

### Q: What's the difference between standalone apps and project apps?

**A**:
- **Standalone Apps**: Created directly in workspace, independently managed, suitable for simple single-purpose tasks
- **Project Apps**: Created within projects, support organized management and app collaboration, suitable for complex scenarios

### Q: How to choose between creating standalone app or project app?

**A**: Choose based on needs:
- Quick testing or simple automation → Standalone app
- Multiple related apps need unified management → Project app
- Team collaboration → Project app

### Q: Can apps share data between each other?

**A**:
- Apps under same project can call each other via HTTP Request nodes
- Use Webhook Trigger to create API endpoints
- Standalone apps can also communicate via APIs

### Q: Can apps be moved after creation?

**A**: Yes. Use "Move to..." function to move apps between projects, or move project app to standalone.

### Q: Will deleting a project delete its apps?

**A**: Yes. Deleting a project will also delete all apps under it. System will prompt for confirmation before deletion.

### Q: Can app names be duplicated?

**A**:
- Apps under different projects can have same name
- Standalone apps and project apps can have same name
- Apps under same project cannot have same name

### Q: Is there a limit on number of apps?

**A**: Depends on your subscription plan:
- Free tier: Limited app count
- Professional: More app quota
- Enterprise: Unlimited

## Next Steps

- [Working with Nodes](/en/guide/working-with-nodes) - Learn how to add and configure nodes
- [Expressions](/en/guide/expressions) - Learn data processing and transformation
- [Chat Trigger](/en/guide/workflow/nodes/trigger-nodes/chat) - Create conversational workflows
- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Build intelligent assistants

## Related Resources

- [Workflow Nodes](/en/guide/workflow/nodes/trigger-nodes/chat) - Learn about all available nodes
