---
title: Version Control
description: Learn how to manage workflow history versions using version control
---

# Version Control

Version control allows you to save different states of your workflow, enabling you to view, compare, and restore to any historical version when needed. This is invaluable for managing workflow evolution, rolling back erroneous changes, and team collaboration.

## Opening Version Control

Find the version control button in the canvas top toolbar:

1. Click the history icon button in the toolbar
2. Version control panel opens on the right
3. Displays list of all saved versions

**Shortcut**: No dedicated shortcut, requires button click to open.

## Creating Versions

### Create New Version

Save the current workflow state as a new version:

**Steps**:
1. Open version control panel
2. Click "Create Version" link
3. Fill in version information:
   - **Version Name** (required): Descriptive name, 1-64 characters
   - **Version Description** (optional): Detailed explanation, up to 256 characters
4. Click "Create Version" button
5. New version added to top of list

**Naming Suggestions**:
```
✓ "Add user authentication feature"
✓ "Fix order calculation error"
✓ "v1.0.0 official release"
✓ "Performance optimization - 2024-03-15"

✗ "Version 1"
✗ "test"
✗ "New version"
```

**Use Cases**:
- Save after completing important features
- Create version before deploying to production
- Save current state before major changes
- Regularly save work progress

### Empty Version List

If no versions exist yet:

1. Panel displays empty state prompt
2. Click "Create Version" button
3. Create first version

## Version List

### Viewing Version List

Version list displays all saved versions:

**Display Order**:
- Latest version at top
- Sorted by creation time in reverse
- Uses virtual scrolling for performance optimization

**Version Card Information**:
- **Version Name**: Identifying name of version
- **Version Description**: Detailed explanation (if provided)
- **Creation Time**: Date and time version was created
- **Current Tag**: Version in use displays "Current" tag
- **Action Menu**: Edit, view details, delete

### Version States

Version cards display different states:

**Current Version**:
- Displays "Current" tag
- Indicates workflow is using this version
- Only shown when workflow is unmodified

**Preview Version**:
- Currently previewed version is highlighted
- Canvas shows this version's content
- Not applied to workflow

**Normal Version**:
- Gray display
- Click to switch preview

## Previewing Versions

### Preview a Version

View historical version content without affecting current workflow:

**Steps**:
1. Find version to preview in version list
2. Click version card
3. Canvas automatically switches to display this version's workflow
4. Version card shows as preview state

**Preview Characteristics**:
- Canvas shows version's nodes and connections
- Can view node configurations (read-only)
- Cannot edit previewed version
- Not applied to actual workflow

### View Version Details

See complete version information:

1. Click menu button (⋯) on version card
2. Select "View Details"
3. Displays detailed version information:
   - Version name
   - Full description
   - Creation time
   - Version ID
4. Click "Back" to return to version list

### Cancel Preview

Return to current workflow state:

**Method 1: Click Cancel**
1. Click "Cancel" button at bottom of panel
2. Canvas restores to current workflow state
3. Preview is canceled

**Method 2: Close Panel**
1. Click area outside panel
2. Or press Esc key
3. Automatically cancels preview

**Method 3: Preview Another Version**
1. Click another version card
2. Switches to new version preview

## Applying Versions

### Apply Previewed Version

Apply previewed version to current workflow:

**Steps**:
1. Preview version to apply
2. Click "Apply" button at bottom of panel
3. System displays confirmation dialog
4. After confirmation, preview version applies to workflow
5. Canvas updates to this version's content

**Important Notes**:
- Applying version will overwrite all current workflow content
- Current unsaved changes will be lost
- Recommend creating current version before applying
- Version control panel automatically closes after applying

**Confirmation Dialog**:
```
Confirm applying version "Version Name"?

Applying this version will overwrite all current workflow content.
Recommend saving current workflow as new version before applying.

[Cancel] [Confirm Apply]
```

### Save Before Applying

Best practice for protecting current work:

1. Before applying another version
2. First create version of current state
3. Then preview and apply historical version
4. Can restore to previous state if needed

**Example Flow**:
```
Current Workflow → Create "Current Progress" Version → Preview Old Version → Apply Old Version
                                                          ↓
                                                  If needed → Apply "Current Progress" Version
```

## Editing Versions

### Modify Version Information

Update version name and description:

**Steps**:
1. Click menu button (⋯) on version card
2. Select "Edit"
3. Modify version information:
   - Version name (1-64 characters)
   - Version description (up to 256 characters)
4. Click "Save" button

**Notes**:
- Can only modify version metadata
- Cannot modify version's workflow content
- Changes take effect immediately

**Use Cases**:
- Add version notes
- Correct incorrect version name
- Add detailed version information

## Deleting Versions

### Delete Unneeded Versions

Clean up historical versions no longer needed:

**Steps**:
1. Click menu button (⋯) on version card
2. Select "Delete"
3. Version card displays confirmation prompt
4. Click again to confirm deletion
5. Or click cancel to abort deletion

**Double Confirmation Mechanism**:
- First click "Delete" shows confirmation prompt
- Need to click "Confirm" again to delete
- Click "Cancel" or other area to abort
- Prevents accidental deletion of important versions

**Restrictions**:
- Cannot delete version currently being previewed
- Deletion is irreversible
- Use caution deleting important versions

## Version Control Panel

### Panel States

Version control panel has multiple view states:

**Version List View**:
- Shows all versions
- Can preview and apply versions
- Main operation interface

**Create Version View**:
- Enter version name and description
- Create new version
- Click back arrow to return to list

**Edit Version View**:
- Modify selected version information
- Save or cancel changes
- Click back arrow to return to list

**Version Details View**:
- Shows complete version information
- Read-only mode
- Click back arrow to return to list

**Empty State View**:
- Displays when no versions exist
- Guides to create first version

### Panel Operations

**Header Operations**:
- History icon + title
- "Create Version" link (version list view)
- Back button (other views)

**Footer Operations**:
- **Version List View**: [Cancel] [Apply]
- **Create Version View**: [Cancel] [Create Version]
- **Edit Version View**: [Cancel] [Save]
- **Version Details View**: [Back]

### Keyboard Operations

**Esc Key**:
- Version list/empty state: Close panel and cancel preview
- Create/edit/details view: Return to version list
- Multiple Esc presses: Return step by step until panel closes

## Use Cases

### Scenario 1: Feature Development

**Workflow**:
1. Create "Pre-development baseline" version before starting new feature
2. Periodically create versions during development
3. Create "New feature complete" version after completion
4. Issue found in testing, preview "Pre-development baseline"
5. Apply "Pre-development baseline" to return to stable state
6. Redevelop new feature

### Scenario 2: Error Recovery

**Problem Scenario**:
1. Error occurs after modifying workflow
2. Unsure where problem is
3. Open version control
4. Preview last known good version
5. Confirm this version works
6. Apply this version to restore workflow

### Scenario 3: A/B Testing

**Testing Process**:
1. Create "Plan A" version
2. Modify workflow to create "Plan B" version
3. Test Plan B effectiveness
4. If Plan A is better, preview and apply "Plan A"
5. If Plan B is better, continue with current version

### Scenario 4: Team Collaboration

**Collaboration Scenario**:
1. Member A creates "My Implementation" version
2. Member B views version list
3. Preview "My Implementation" version
4. Understand Member A's work
5. Continue improving based on this version

## Best Practices

### 1. Create Versions Regularly

**Recommended Timing**:
- After completing each functional module
- Before each important change
- End of each work day
- Before deploying to production

### 2. Clear Version Naming

**Naming Conventions**:
```
By Feature:
✓ "Add payment functionality"
✓ "Fix data validation"

By Time:
✓ "2024-03-15 backup"
✓ "Q3 version"

By Version Number:
✓ "v1.0.0 official"
✓ "v1.1.0 new features"

By Status:
✓ "Development complete pending test"
✓ "Production current version"
```

### 3. Add Detailed Descriptions

**Description Content**:
- What features were modified
- Why these changes were made
- Which nodes are affected
- Test results
- Important notes

**Example**:
```
Version Name: "Optimize order processing flow"

Description:
1. Added order validation node
2. Optimized inventory check logic
3. Fixed amount calculation error
4. Testing passed, ready to deploy
5. Note: Need to update ORDER_API_KEY environment variable
```

### 4. Regular Cleanup of Old Versions

**Cleanup Strategy**:
- Delete temporary test versions
- Keep important milestone versions
- Keep production environment versions
- Keep versions from last 30 days

### 5. Backup Before Important Operations

**Backup Timing**:
- Before major refactoring
- Before applying others' versions
- Before trying new features
- Before modifying critical logic

## FAQ

### Q: What content does a version save?

**A**: Version saves complete workflow state, including:
- All nodes and their configurations
- Connections between nodes
- Canvas layout information
- Workflow metadata

Does not include:
- Execution history
- Test data
- Runtime state

### Q: How many versions can be created?

**A**: No hard limit on version count, but recommend:
- Regularly clean up unneeded versions
- Keep version list clear and manageable
- Too many versions may affect loading speed

### Q: Can I edit while previewing a version?

**A**: No. Preview mode is read-only:
- Can view node configurations
- Can browse workflow structure
- Cannot modify any content
- Must apply version before editing

### Q: Does applying a version affect execution history?

**A**: No. Applying version only affects workflow structure:
- Execution history remains unchanged
- Log data is not affected
- Only workflow configuration changes

### Q: How to compare differences between two versions?

**A**: Currently requires manual comparison:
1. Preview version A, note key configurations
2. Preview version B, view differences
3. Future version will support automatic comparison

### Q: Can deleted versions be recovered?

**A**: No. Version deletion is permanent:
- Cannot be recovered after deletion
- Double confirmation before deletion
- Recommend keeping important versions

### Q: Can version names be duplicated?

**A**: Yes, but not recommended:
- System allows duplicate names
- Differentiated by creation time
- Recommend using unique descriptive names

### Q: Will unsaved changes be lost when switching versions?

**A**: Yes. Before applying version:
1. System will prompt for confirmation
2. Recommend saving current changes as new version first
3. Then apply other version

## Related Resources

- [Execute Workflow](/en/guide/workflow/execute-workflow) - Learn how to test workflows
- [Debug Workflow](/en/guide/workflow/debug-workflow) - Learn debugging techniques
- [Editing Nodes](/en/guide/editing-nodes) - Configure node parameters
