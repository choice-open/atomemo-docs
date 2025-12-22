---
title: 知识存储节点
description: 将文档和文件存储到知识库中，用于后续的知识检索
---

# 知识存储节点

知识存储节点用于将文档和文件存储到知识库中，使其可以被知识检索节点搜索和使用。它是构建知识库系统的核心节点之一，与知识检索节点配合使用可以构建完整的 RAG（检索增强生成）系统。

## 使用场景

### 典型应用
- **文档入库** - 将产品手册、技术文档等批量导入知识库
- **知识更新** - 定期更新知识库内容，保持信息最新
- **用户上传** - 处理用户上传的文档并存储到知识库
- **自动化知识管理** - 从多个来源自动收集和存储知识
- **文档预处理** - 提取文档中的实体信息并存储
- **图片提取** - 从文档中提取图片并存储

## 节点配置

### 基础设置（参数面板）

#### 文件 (files)

要存储到知识库的文件。

**字段属性**:
- 必填字段
- 支持表达式
- 可以引用工作流中的文件引用

**配置示例**:

```javascript
// 1. 引用文件上传节点的文件
$('文件上传').files

// 2. 引用 Webhook 接收的文件
$('Webhook触发器').files

// 3. 使用表达式动态选择文件
$('HTTP Request').body.fileUrl

// 4. 引用代码节点处理的文件
$('代码').processedFiles
```

**支持的文件格式**:
- PDF 文档
- Word 文档 (.docx)
- Markdown 文件 (.md)
- 文本文件 (.txt)
- 其他支持的文档格式

#### 知识库 (knowledgeBaseId)

选择要存储文件的目标知识库。

**字段属性**:
- 必填字段
- 从已创建的知识库中选择
- 不支持表达式（静态选择）

**配置示例**:

```yaml
知识库: "kb_product_manual_2024"
```

**注意事项**:
- 确保知识库已创建
- 文件将存储到指定的知识库中
- 可以在知识库管理页面查看已存储的文件

#### 实体类型 (entityTypes)

指定要从文档中提取的实体类型。

**字段属性**:
- 可选字段
- 数组类型
- 用于结构化信息提取

**配置示例**:

```javascript
// 提取产品相关的实体
entityTypes: ["product", "price", "specification"]

// 提取人物和地点实体
entityTypes: ["person", "location", "organization"]

// 提取技术相关实体
entityTypes: ["technology", "version", "api"]
```

**用途**:
- 提取文档中的结构化信息
- 增强检索时的语义理解
- 支持实体级别的检索

#### 解析图片 (extractImages)

是否从文档中提取并存储图片。

**字段属性**:
- 布尔值
- 默认值: `false`

**说明**:
- 启用后，文档中的图片会被提取并存储
- 图片可以用于后续的检索和展示
- 适合包含图表、截图的文档

**配置示例**:

```yaml
extractImages: true  # 提取图片
extractImages: false # 不提取图片（默认）
```

### 高级设置（设置面板）

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "将产品手册存储到知识库"
```

## 输出数据

知识存储节点返回存储操作的结果。

**输出结构**:

```javascript
{
  success: true,              // 是否成功
  knowledgeBaseId: "kb_xxx",  // 知识库ID
  fileCount: 5,               // 存储的文件数量
  entityCount: 120,           // 提取的实体数量（如果启用实体提取）
  message: "存储成功"          // 操作消息
}
```

**访问输出**:

```javascript
// 检查是否成功
$('知识存储').success

// 获取知识库ID
$('知识存储').knowledgeBaseId

// 获取文件数量
$('知识存储').fileCount

// 获取实体数量
$('知识存储').entityCount
```

## 工作流示例

### 示例 1: 批量文档入库

```
文件上传节点
  → 知识存储节点
    文件: $('文件上传').files
    知识库: "kb_company_docs"
    实体类型: ["document", "section", "keyword"]
    解析图片: true
  → 通知节点
    发送入库成功通知
```

### 示例 2: 用户上传文档处理

```
Webhook 触发器（接收文件上传）
  → 代码节点（验证文件）
    代码: |
      function main({files}) {
        // 验证文件类型和大小
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
  → 条件分支
    条件: $('代码').count > 0
    → [True] → 知识存储节点
      文件: $('代码').validFiles
      知识库: "kb_user_uploads"
      → 回答节点
        回答: "文档已成功上传并存储"
    → [False] → 回答节点
      回答: "文件格式不支持或文件过大"
```

### 示例 3: 定期更新知识库

```
定时触发器（每天执行）
  → HTTP Request 节点
    URL: "https://api.example.com/docs/latest"
    获取最新文档列表
  → 代码节点
    代码: |
      function main({response}) {
        // 过滤需要更新的文档
        const newDocs = response.documents.filter(doc => {
          return doc.updatedAt > getLastUpdateTime();
        });
        
        return {
          files: newDocs.map(doc => doc.fileUrl),
          count: newDocs.length
        };
      }
  → 条件分支
    条件: $('代码').count > 0
    → [True] → HTTP Request 节点（下载文件）
      → 知识存储节点
        文件: $('HTTP Request').files
        知识库: "kb_product_docs"
        实体类型: ["product", "feature", "specification"]
      → 通知节点
        通知: `已更新 ${$('代码').count} 个文档`
```

### 示例 4: 文档预处理和存储

```
文件上传节点
  → 代码节点（文档预处理）
    代码: |
      function main({files}) {
        // 提取文档元数据
        const processedFiles = files.map(file => ({
          ...file,
          metadata: {
            uploadTime: new Date().toISOString(),
            category: extractCategory(file.name),
            tags: extractTags(file.content)
          }
        }));
        
        return {processedFiles};
      }
  → 知识存储节点
    文件: $('代码').processedFiles
    知识库: "kb_processed_docs"
    实体类型: ["category", "tag", "keyword"]
    解析图片: true
  → 数据库节点
    记录文档元数据
```

### 示例 5: 多知识库分类存储

```
文件上传节点
  → AI 分类器节点
    输入: $('文件上传').files[0].name
    类别: ["技术文档", "产品手册", "FAQ", "其他"]
  → 代码节点
    代码: |
      function main({class}) {
        const knowledgeBaseMap = {
          "技术文档": "kb_technical_docs",
          "产品手册": "kb_product_manual",
          "FAQ": "kb_faq",
          "其他": "kb_general"
        };
        
        return {
          knowledgeBaseId: knowledgeBaseMap[class] || "kb_general"
        };
      }
  → 知识存储节点
    文件: $('文件上传').files
    知识库: $('代码').knowledgeBaseId  // 根据分类选择知识库
    实体类型: ["document", "section"]
```

### 示例 6: 带实体提取的文档存储

```
文件上传节点
  → 知识存储节点
    文件: $('文件上传').files
    知识库: "kb_product_info"
    实体类型: [
       "product_name",
       "price",
       "specification",
       "feature",
       "category"
     ]
    解析图片: true
  → 代码节点（处理实体）
    代码: |
      function main({entities}) {
        // 验证实体提取结果
        const requiredEntities = ['product_name', 'price'];
        const hasRequired = requiredEntities.every(
          e => entities.some(ent => ent.type === e)
        );
        
        return {
          valid: hasRequired,
          entityCount: entities.length,
          entities: entities
        };
      }
  → 条件分支
    条件: $('代码').valid === true
    → [True] → 数据库节点
      存储实体信息
    → [False] → 通知节点
      通知: "文档缺少必要的实体信息"
```

## 最佳实践

### 1. 合理选择知识库

**按主题分类**:
```yaml
kb_product_catalog: 产品目录
kb_technical_docs: 技术文档
kb_faq: 常见问题
kb_user_guides: 用户指南
```

**按来源分类**:
```yaml
kb_internal_docs: 内部文档
kb_external_resources: 外部资源
kb_user_uploads: 用户上传
```

### 2. 配置实体类型

**根据文档类型选择实体**:
```javascript
// 产品文档
entityTypes: ["product", "price", "specification", "feature"]

// 技术文档
entityTypes: ["technology", "api", "version", "parameter"]

// 通用文档
entityTypes: ["document", "section", "keyword"]
```

### 3. 文件预处理

**验证文件**:
```javascript
// 在代码节点中验证文件
function main({files}) {
  const validFiles = files.filter(file => {
    // 检查文件类型
    const ext = file.name.split('.').pop();
    const allowedTypes = ['pdf', 'docx', 'txt', 'md'];
    
    // 检查文件大小（例如 10MB）
    const maxSize = 10 * 1024 * 1024;
    
    return allowedTypes.includes(ext) && file.size <= maxSize;
  });
  
  return {validFiles};
}
```

### 4. 处理存储结果

**检查存储状态**:
```javascript
条件分支:
  条件: $('知识存储').success === true
  → [True] → 通知成功
  → [False] → 处理错误
```

### 5. 定期更新策略

**实现更新检查**:
```javascript
// 检查文档更新时间
function main({file}) {
  const lastUpdate = getLastUpdateTime(file.id);
  const fileUpdate = file.updatedAt;
  
  return {
    needsUpdate: fileUpdate > lastUpdate,
    file: file
  };
}
```

## 常见问题

### Q1: 支持哪些文件格式？

**A**: 支持常见的文档格式：
- PDF (.pdf)
- Word 文档 (.docx)
- Markdown (.md)
- 文本文件 (.txt)
- 其他系统支持的格式

具体支持的格式可能因系统配置而异。

### Q2: 文件大小有限制吗？

**A**: 通常有文件大小限制，建议：
- 单个文件不超过 10-50MB（取决于系统配置）
- 大文件可以拆分为多个小文件
- 批量上传时注意总大小限制

### Q3: 实体类型是什么？

**A**: 实体类型用于从文档中提取结构化信息：

```javascript
// 例如，从产品文档中提取
entityTypes: ["product", "price", "specification"]

// 提取的结果可以在检索时使用
// 提高检索的准确性和相关性
```

### Q4: 如何知道存储是否成功？

**A**: 检查输出数据：

```javascript
// 检查成功状态
$('知识存储').success === true

// 获取文件数量
$('知识存储').fileCount

// 获取操作消息
$('知识存储').message
```

### Q5: 可以存储图片吗？

**A**: 可以，启用 `extractImages` 选项：

```yaml
解析图片: true
```

系统会从文档中提取图片并存储，图片可以在检索时使用。

### Q6: 存储后多久可以检索？

**A**: 通常存储后可以立即检索，但处理时间取决于：
- 文件大小和数量
- 是否启用实体提取
- 是否启用图片提取
- 系统负载情况

### Q7: 如何更新已存储的文档？

**A**: 
1. 删除旧文档（如果需要）
2. 重新上传更新后的文档
3. 系统会自动处理新的版本

### Q8: 可以批量存储吗？

**A**: 可以，一次可以传入多个文件：

```javascript
// 引用多个文件
$('文件上传').files  // 数组格式

// 知识存储节点会处理所有文件
```

### Q9: 存储失败怎么办？

**A**: 实现错误处理：

```javascript
条件分支:
  条件: $('知识存储').success === false
  → [True] → 通知节点
    通知: `存储失败: ${$('知识存储').message}`
  → [False] → 继续流程
```

### Q10: 如何验证文档质量？

**A**: 在存储前验证：

```javascript
代码节点（验证文档）:
  代码: |
    function main({files}) {
      // 检查文件格式
      // 检查文件内容
      // 提取必要信息
      
      return {
        valid: true,
        quality: "high",
        files: files
      };
    }
  
  条件分支:
    条件: $('代码').valid === true
    → [True] → 知识存储节点
    → [False] → 拒绝并通知
```

## 下一步

- [知识检索节点](/zh-hans/guide/workflow/nodes/action-nodes/knowledge-retrieval) - 检索已存储的知识
- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 使用知识库构建智能助手
- [文件上传节点](/zh-hans/guide/workflow/nodes/action-nodes/file-upload) - 获取要存储的文件

## 相关资源

- [知识检索节点](/zh-hans/guide/workflow/nodes/action-nodes/knowledge-retrieval) - 了解如何检索存储的知识
- [RAG 系统构建](/zh-hans/guide/workflow/rag-system) - 学习构建完整的 RAG 系统
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在配置中使用表达式

