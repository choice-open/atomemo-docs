---
title: Array Methods
description: Array data transformation methods reference
---

# Array Methods

Array methods are used to process and transform array data. All methods can be chained.

## Method Reference

### average()

Returns the average value of numeric elements in an array.

**Returns**: `Number`

**Examples**:

```javascript
{{ [1, 2, 3, 4, 5].average() }}
// 3

{{ [10, 20, 30].average() }}
// 20

{{ $('HTTP Request').body.prices.average() }}
// Calculate average price
```

---

### chunk(size: Number)

Splits an array into multiple chunks of specified size.

**Parameters**:
- `size` (Number): Size of each chunk

**Returns**: `Array`

**Examples**:

```javascript
{{ [1, 2, 3, 4, 5].chunk(2) }}
// [[1, 2], [3, 4], [5]]

{{ ['a', 'b', 'c', 'd', 'e', 'f'].chunk(3) }}
// [['a', 'b', 'c'], ['d', 'e', 'f']]

{{ $('HTTP Request').body.items.chunk(10) }}
// Process 10 items at a time
```

---

### compact()

Removes null values (`null` and `undefined`) from an array.

**Returns**: `Array`

**Examples**:

```javascript
{{ [1, null, 2, undefined, 3].compact() }}
// [1, 2, 3]

{{ [0, false, '', null, undefined, 'hello'].compact() }}
// [0, false, '', 'hello']
// Note: 0, false, '' are not removed

{{ $('HTTP Request').body.users.compact() }}
// Remove null users
```

---

### difference(arr: Array)

Compares two arrays and returns all elements in the base array that are not in `arr`.

**Parameters**:
- `arr` (Array): Array to compare against

**Returns**: `Array`

**Examples**:

```javascript
{{ [1, 2, 3, 4, 5].difference([3, 4, 5, 6, 7]) }}
// [1, 2]

{{ ['a', 'b', 'c'].difference(['b', 'c', 'd']) }}
// ['a']

{{ $('Current Users').users.difference($('Previous Users').users) }}
// Find new users
```

---

### intersection(arr: Array)

Compares two arrays and returns all elements in the base array that also exist in `arr`.

**Parameters**:
- `arr` (Array): Array to compare against

**Returns**: `Array`

**Examples**:

```javascript
{{ [1, 2, 3, 4, 5].intersection([3, 4, 5, 6, 7]) }}
// [3, 4, 5]

{{ ['a', 'b', 'c'].intersection(['b', 'c', 'd']) }}
// ['b', 'c']

{{ $('List A').items.intersection($('List B').items) }}
// Find common items
```

---

### first()

Returns the first element of an array. Returns `undefined` if array is empty.

**Returns**: `Array item`

**Examples**:

```javascript
{{ [1, 2, 3].first() }}
// 1

{{ ['apple', 'banana', 'cherry'].first() }}
// 'apple'

{{ [].first() }}
// undefined

{{ $('HTTP Request').body.items.first() }}
// First item
```

---

### isEmpty()

Checks if an array is empty (has no elements).

**Returns**: `Boolean`

**Examples**:

```javascript
{{ [].isEmpty() }}
// true

{{ [1, 2, 3].isEmpty() }}
// false

{{ $('HTTP Request').body.items.isEmpty() }}
// Check if there are any items
```

---

### isNotEmpty()

Checks if an array contains elements.

**Returns**: `Boolean`

**Examples**:

```javascript
{{ [1, 2, 3].isNotEmpty() }}
// true

{{ [].isNotEmpty() }}
// false

{{ $('HTTP Request').body.users.isNotEmpty() }}
// Check if there are any users
```

---

### last()

Returns the last element of an array. Returns `undefined` if array is empty.

**Returns**: `Array item`

**Examples**:

```javascript
{{ [1, 2, 3].last() }}
// 3

{{ ['apple', 'banana', 'cherry'].last() }}
// 'cherry'

{{ [].last() }}
// undefined

{{ $('HTTP Request').body.items.last() }}
// Last item
```

---

### max()

Returns the maximum value in the array.

**Returns**: `Number`

**Examples**:

```javascript
{{ [1, 5, 3, 9, 2].max() }}
// 9

{{ [-10, -5, -20].max() }}
// -5

{{ $('HTTP Request').body.prices.max() }}
// Highest price
```

---

### merge(arr: Array)

Merges two arrays into one. For object arrays, all elements are preserved.

**Parameters**:
- `arr` (Array): Array to merge into the base array

**Returns**: `Array`

**Examples**:

```javascript
{{ [1, 2, 3].merge([4, 5]) }}
// [1, 2, 3, 4, 5]

{{ [].merge([4, 5]) }}
// [4, 5]

{{ [1, 2, 3].merge([]) }}
// [1, 2, 3]

{{ [].merge([]) }}
// []

{{ [1, 2, 3].merge([3, 2, 5]) }}
// [1, 2, 3, 3, 2, 5]
// Note: Does not automatically deduplicate

{{ $('List A').items.merge($('List B').items) }}
// Merge two lists
```

---

### min()

Returns the minimum value in an array containing only numbers.

**Returns**: `Number`

**Examples**:

```javascript
{{ [1, 5, 3, 9, 2].min() }}
// 1

{{ [-10, -5, -20].min() }}
// -20

{{ $('HTTP Request').body.prices.min() }}
// Lowest price
```

---

### pluck(fieldName?: String)

Returns an array of objects where each object only contains the specified field name as a key.

**Parameters**:
- `fieldName` (String, optional): Field name to extract

**Returns**: `Array`

**Examples**:

```javascript
{{ [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
].pluck('name') }}
// ['Alice', 'Bob']

{{ [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
].pluck('age') }}
// [25, 30]

{{ $('HTTP Request').body.users.pluck('email') }}
// Extract all user emails
```

---

### randomItem()

Returns a random element from the array.

**Returns**: `Array item`

**Examples**:

```javascript
{{ [1, 2, 3, 4, 5].randomItem() }}
// Randomly returns a number, e.g.: 3

{{ ['red', 'green', 'blue'].randomItem() }}
// Randomly returns a color

{{ $('HTTP Request').body.quotes.randomItem() }}
// Randomly select a quote
```

---

### removeDuplicates(key?: String)

Removes duplicate elements from an array.

**Parameters**:
- `key` (String, optional): For object arrays, specifies the field name to use for duplicate detection

**Returns**: `Array`

**Examples**:

```javascript
// Deduplicate simple array
{{ [1, 2, 2, 3, 3, 3, 4].removeDuplicates() }}
// [1, 2, 3, 4]

// Object array, deduplicate by specified field
{{ [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" }
].removeDuplicates("id") }}
// [
//   { "id": 1, "name": "Alice" },
//   { "id": 2, "name": "Bob" }
// ]

// Object array without specifying field
// Different object references won't be deduplicated even if content is the same
{{ [
  { id: 1, name: "Alice" },
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
].removeDuplicates() }}
// [
//   { "id": 1, "name": "Alice" },
//   { "id": 1, "name": "Alice" },
//   { "id": 2, "name": "Bob" }
// ]

{{ $('HTTP Request').body.users.removeDuplicates('email') }}
// Deduplicate by email
```

---

### renameKeys(from: String, to: String)

Renames all matching keys in the array. You can rename multiple keys by providing comma-separated strings.

**Parameters**:
- `from` (String): Original key names to rename (comma-separated)
- `to` (String): New key names (comma-separated)

**Returns**: `Array`

**Examples**:

```javascript
// Rename single key
{{ [
  { oldName: 'Alice', age: 25 },
  { oldName: 'Bob', age: 30 }
].renameKeys('oldName', 'newName') }}
// [
//   { "newName": "Alice", "age": 25 },
//   { "newName": "Bob", "age": 30 }
// ]

// Rename multiple keys
{{ [
  { firstName: 'Alice', lastName: 'Smith' }
].renameKeys('firstName,lastName', 'first,last') }}
// [
//   { "first": "Alice", "last": "Smith" }
// ]

{{ $('HTTP Request').body.users.renameKeys('user_id,user_name', 'id,name') }}
// Convert API field names to internal field names
```

---

### sum()

Returns the sum of all values in an array of parseable numbers.

**Returns**: `Number`

**Examples**:

```javascript
{{ [1, 2, 3, 4, 5].sum() }}
// 15

{{ [10, 20, 30].sum() }}
// 60

{{ $('HTTP Request').body.prices.sum() }}
// Total price
```

---

### toJsonString()

Converts an array to a JSON string. Equivalent to `JSON.stringify`.

**Returns**: `String`

**Examples**:

```javascript
{{ [1, 2, 3].toJsonString() }}
// "[1,2,3]"

{{ [{ name: 'Alice' }, { name: 'Bob' }].toJsonString() }}
// '[{"name":"Alice"},{"name":"Bob"}]'

{{ $('HTTP Request').body.items.toJsonString() }}
// Convert array to JSON string for storage or transmission
```

---

### union(arr: Array)

Merges two arrays and removes duplicates.

**Parameters**:
- `arr` (Array): Array to merge

**Returns**: `Array`

**Examples**:

```javascript
{{ [1, 2, 3].union([3, 4, 5]) }}
// [1, 2, 3, 4, 5]

{{ ['a', 'b'].union(['b', 'c']) }}
// ['a', 'b', 'c']

{{ $('List A').items.union($('List B').items) }}
// Merge two lists and deduplicate
```

---

### unique(key?: String)

Removes duplicates from an array. Same functionality as `removeDuplicates()`.

**Parameters**:
- `key` (String, optional): For object arrays, specifies the field name to use for duplicate detection

**Returns**: `Array`

**Examples**:

```javascript
{{ [1, 1, 2, 2, 3].unique() }}
// [1, 2, 3]

{{ [
  { id: 1, name: 'Alice' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
].unique('id') }}
// [
//   { "id": 1, "name": "Alice" },
//   { "id": 2, "name": "Bob" }
// ]
```

## Method Chaining

Array methods can be chained:

```javascript
{{ $('HTTP Request').body.items
  .filter(item => item.active)
  .pluck('price')
  .compact()
  .average() }}
// Calculate average price of all active items
```

## Use Cases

### 1. Data Extraction

```javascript
// Extract all user emails
{{ $('Get Users').body.users.pluck('email') }}

// Extract first and last items
{{ $('HTTP Request').body.items.first() }}
{{ $('HTTP Request').body.items.last() }}
```

### 2. Data Aggregation

```javascript
// Calculate total price
{{ $('HTTP Request').body.prices.sum() }}

// Calculate average score
{{ $('HTTP Request').body.scores.average() }}

// Find highest and lowest prices
{{ $('HTTP Request').body.prices.max() }}
{{ $('HTTP Request').body.prices.min() }}
```

### 3. Data Cleaning

```javascript
// Remove null values
{{ $('HTTP Request').body.items.compact() }}

// Deduplicate
{{ $('HTTP Request').body.users.unique('id') }}

// Rename fields
{{ $('HTTP Request').body.users.renameKeys('user_id', 'id') }}
```

### 4. Data Merging

```javascript
// Merge two lists
{{ $('List A').items.merge($('List B').items) }}

// Merge and deduplicate
{{ $('List A').items.union($('List B').items) }}

// Find common items
{{ $('List A').items.intersection($('List B').items) }}

// Find differences
{{ $('List A').items.difference($('List B').items) }}
```

### 5. Data Grouping

```javascript
// Split array into chunks for processing
{{ $('HTTP Request').body.items.chunk(10) }}
// Process 10 items at a time
```

## Best Practices

### 1. Check if Array is Empty

```javascript
// Check before processing
{{ $('HTTP Request').body.items.isNotEmpty() }}
```

### 2. Handle Potentially Missing Fields

```javascript
// Use compact to remove null values
{{ $('HTTP Request').body.users.pluck('email').compact() }}
```

### 3. Combine Multiple Methods

```javascript
// Chain multiple methods
{{ $('HTTP Request').body.items
  .compact()
  .unique('id')
  .pluck('name') }}
```

### 4. Performance Considerations

```javascript
// Filter first to reduce data volume before processing
{{ $('HTTP Request').body.items
  .filter(item => item.active)
  .pluck('price')
  .sum() }}
```

## Related Resources

- [Expressions Overview](/en/guide/expressions)
- [Object Methods](/en/guide/expressions/objects)
- [String Methods](/en/guide/expressions/strings)
- [Code Node](/en/guide/workflow/nodes/action-nodes/code)
