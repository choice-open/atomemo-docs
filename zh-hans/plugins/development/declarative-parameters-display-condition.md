# DisplayCondition — 条件显示/隐藏

`DisplayCondition` 使用类似 MongoDB 查询语法的条件表达式，根据**同级其他字段**的值控制参数的显示与隐藏。

### 基本语法

```typescript
interface PropertyBase {
  display?: {
    show?: DisplayCondition // 条件为真时显示
    hide?: DisplayCondition // 条件为真时隐藏
  }
}
```

- `show` 和 `hide` 可以同时存在。先评估 `show`，再评估 `hide`。
- 参数默认可见。设置了 `show` 后，只有满足条件才可见。

### 条件运算符

```typescript
type FilterOperators = {
  $eq?: any // 等于
  $ne?: any // 不等于
  $gt?: number // 大于
  $gte?: number // 大于等于
  $lt?: number // 小于
  $lte?: number // 小于等于
  $in?: any[] // 在数组中
  $nin?: any[] // 不在数组中
  $exists?: boolean // 字段是否存在
  $regex?: string // 正则匹配
  $options?: string // 正则选项（如 "i" 忽略大小写）
  $mod?: [number, number] // 取模 [除数, 余数]
  $size?: number // 数组长度
}
```

### 逻辑运算符

```typescript
type DisplayCondition = {
  // 字段级匹配——键为字段名，值为匹配条件
  [fieldName: string]: any | FilterOperators

  // 逻辑组合
  $and?: DisplayCondition[] // 全部满足
  $or?: DisplayCondition[] // 任一满足
  $nor?: DisplayCondition[] // 全部不满足
}
```

### 匹配规则

| 写法                               | 含义                  |
| ---------------------------------- | --------------------- |
| `{ "field": "value" }`             | `field === "value"`   |
| `{ "field": { $eq: "value" } }`    | `field === "value"`   |
| `{ "field": { $ne: "value" } }`    | `field !== "value"`   |
| `{ "field": { $in: ["a", "b"] } }` | `field 是 "a" 或 "b"` |
| `{ "field": { $exists: true } }`   | `field 已设置`        |
| `{ "field": { $gt: 10 } }`         | `field > 10`          |
| `{ "a.b.c": "value" }`             | 支持嵌套路径访问      |

### 示例

**场景 1**：当 `format` 为 `"json"` 时，显示 `schema` 参数

```typescript
{
  name: "schema",
  type: "string",
  display: {
    show: { format: { $eq: "json" } }
  },
  ui: { component: "code-editor", language: "json" }
}
```

**场景 2**：当 `include_links` 为 `true` 时显示链接相关选项

```typescript
{
  name: "link_selector",
  type: "string",
  display: {
    show: { include_links: { $eq: true } }
  }
}
```

**场景 3**：复合条件——格式为 markdown 且启用了 headers

```typescript
{
  name: "header_level",
  type: "integer",
  display: {
    show: {
      $and: [
        { format: "markdown" },
        { include_headers: true }
      ]
    }
  }
}
```

**场景 4**：多值匹配——格式为 html 或 markdown

```typescript
{
  name: "css_selector",
  type: "string",
  display: {
    show: { format: { $in: ["html", "markdown"] } }
  }
}
```

