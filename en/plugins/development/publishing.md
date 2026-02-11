# Publishing Your Plugin

When you've finished developing a plugin, you can publish it to the official Atomemo plugin repository, allowing all users to discover and install your plugin from the plugin marketplace.

The official Atomemo plugin repository is hosted on [GitHub](https://github.com/choice-open/atomemo-official-plugins). The publishing process uses Pull Request (PR) automation for review and release.

## Before Publishing

Before submitting a PR, please complete the following checks:

1. **Metadata Completeness**:
   - Check that `name`, `version`, `description`, and `author` fields in `package.json` are accurate.
   - Verify that information in the plugin definition (`createPlugin`) matches `package.json`.
2. **Code Quality**:
   - Ensure code has no linting errors.
   - Remove all debug code (e.g., `console.log`).
3. **Security**:
   - **Never** hardcode any private keys (API Keys, Tokens) in your code.
   - All sensitive information must be collected from users through the [Credentials](./credential.md) mechanism.
4. **Documentation**:
   - Provide clear `README.md` documentation explaining the plugin's functionality and usage.
5. **Build and Release Scripts**:
   - Before publishing or updating a plugin, always run the release script defined in `package.json` to ensure artifacts and metadata are correct.
   - If using Bun:
     ```bash
     bun run release
     ```
   - This script automatically generates/validates manifests, builds artifacts, syncs versions, etc., preventing PR rejection by automated checks.

## Submission Process

### 1. Fork the Official Repository

Visit the [atomemo-official-plugins](https://github.com/choice-open/atomemo-official-plugins) repository and click the **Fork** button in the top right to fork the repository to your personal account.

### 2. Add Your Plugin Code

Clone your forked repository locally:

```bash
git clone https://github.com/YOUR_USERNAME/atomemo-official-plugins.git
cd atomemo-official-plugins
```

Place your plugin code in the `plugins` directory. Your directory structure should look like this:

```text
plugins/
  your-plugin-name/    # Your plugin directory
    package.json
    src/
    README.md
    ...
```

### 3. Submit a Pull Request

Push your code to your fork and then create a Pull Request (PR) to the official repository's `main` branch.

- **PR Title**: `feat(plugin): add <your-plugin-name>`
- **PR Description**: Brief introduction to your plugin's functionality.

### 4. Automated Review and Publishing

After submitting the PR, GitHub Actions will automatically run a series of checks:
- **Lint**: Code style checks.
- **Build**: Ensures the plugin can be built successfully.
- **Manifest Check**: Validates the manifest file format.

After passing automated checks and human review, your PR will be merged. Once merged, the Atomemo plugin marketplace will automatically index your plugin, and users can search for and install it.

## Updating Your Plugin

If you need to update a published plugin (e.g., bug fixes or new features):

1. Modify your plugin code.
2. **Important**: Update the version number in `package.json` and plugin definition (e.g., from `1.0.0` -> `1.0.1`).
3. Follow the process above to submit a new Pull Request.

Once the PR is merged, the plugin marketplace will automatically detect the new version and push it to users.
