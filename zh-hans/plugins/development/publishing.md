# 发布插件

当你开发完一个插件后，可以将其发布到 Atomemo 官方插件仓库，让所有用户都能在插件市场中发现并安装你的插件。

Atomemo 官方插件仓库托管在 [GitHub](https://github.com/choice-open/atomemo-official-plugins)。发布流程采用 Pull Request (PR) 自动化审核与发布。

## 发布前准备

在提交 PR 之前，请务必完成以下检查：

1.  **元数据完整性**：
    *   检查 `package.json` 中的 `name`, `version`, `description`, `author` 字段是否准确。
    *   检查插件定义（`createPlugin`）中的信息是否与 `package.json` 一致。
2.  **代码质量**：
    *   确保代码没有 Lint 错误。
    *   删除所有调试代码（如 `console.log`）。
3.  **安全性**：
    *   **严禁**在代码中硬编码任何私有密钥（API Keys、Tokens）。
    *   所有敏感信息必须通过 [凭证 (Credentials)](./credential.md) 机制由用户输入。
4.  **文档**：
    *   提供清晰的 `README.md`，说明插件的功能和使用方法。
5.  **构建与发布脚本**：
    *   在发布或更新插件前，务必运行 `package.json` 中定义的 release 脚本，确保产物和元数据正确。
    *   如果你使用 bun，运行：
      ```bash
      bun run release
      ```
    *   该脚本会自动生成/校验 manifest、构建产物、同步版本号等，避免 PR 被自动检查拒绝。

## 提交流程

### 1. Fork 官方仓库

访问 [atomemo-official-plugins](https://github.com/choice-open/atomemo-official-plugins) 仓库，点击右上角的 **Fork** 按钮，将仓库 Fork 到你的个人账户下。

### 2. 添加插件代码

将你的仓库克隆到本地：

```bash
git clone https://github.com/YOUR_USERNAME/atomemo-official-plugins.git
cd atomemo-official-plugins
```

将你的插件代码放置在 `plugins` 目录下。目录结构应如下所示：

```text
plugins/
  your-plugin-name/    # 你的插件目录
    package.json
    src/
    README.md
    ...
```

### 3. 提交 Pull Request

提交代码到你的 Fork 仓库，然后创建一个 Pull Request (PR) 到官方仓库的 `main` 分支。

*   **PR 标题**：`feat(plugin): add <your-plugin-name>`
*   **PR 描述**：简要介绍插件的功能。

### 4. 自动化审核与发布

提交 PR 后，GitHub Actions 会自动运行一系列检查：
*   **Lint**: 代码风格检查。
*   **Build**: 确保插件可以成功构建。
*   **Manifest Check**: 验证插件清单文件的格式。

通过自动化检查和人工审核后，你的 PR 将被合并。合并后，Atomemo 的插件市场会自动索引你的插件，用户即可在市场中搜索并安装。

## 更新插件

如果你需要更新已发布的插件（例如修复 Bug 或添加新功能）：

1.  修改插件代码。
2.  **重要**：在 `package.json` 和插件定义中提升版本号（例如从 `1.0.0` -> `1.0.1`）。
3.  按照上述流程提交一个新的 Pull Request。

一旦 PR 合并，插件市场将自动检测到新版本并推送给用户。
