---
title: Date Methods
description: Date and time data transformation methods reference
---

# Date Methods

Date methods are used to process and transform date and time data. {{PRODUCT_NAME}} uses the Luxon library for date and time handling.

## Method Reference

### beginningOf(unit?: DurationUnit)

Converts a date to the beginning of the specified time period. Returns JavaScript Date or Luxon DateTime depending on input type.

**Parameters**:
- `unit` (DurationUnit, optional): Valid string specifying time unit. Values: `second`, `minute`, `hour`, `day`, `week`, `month`, `year`. Default: `week`.

**Returns**: `Date`

**Examples**:

```javascript
// Assuming current time is 2025-09-18T15:30:45.123-04:00

{{ $now().beginningOf('day') }}
// 2025-09-18T00:00:00.000-04:00

{{ $now().beginningOf('week') }}
// 2025-09-15T00:00:00.000-04:00 (Monday)

{{ $now().beginningOf('month') }}
// 2025-09-01T00:00:00.000-04:00

{{ $now().beginningOf('year') }}
// 2025-01-01T00:00:00.000-04:00

{{ $('HTTP Request').body.createdAt.beginningOf('day') }}
// Get start of day for creation date
```

---

### endOfMonth()

Converts a date to the end of the month (last day at 23:59:59.999).

**Returns**: `Date`

**Examples**:

```javascript
// Assuming current time is 2025-09-18T15:30:45.123-04:00

{{ $now().endOfMonth() }}
// 2025-09-30T23:59:59.999-04:00

{{ $('HTTP Request').body.startDate.endOfMonth() }}
// Get end of month time
```

---

### extract(datePart?: DurationUnit)

Extracts a specified part from a date: year, month, day, etc. Returns a number.

**Parameters**:
- `datePart` (DurationUnit, optional): Valid string specifying time unit. Values: `second`, `minute`, `hour`, `day`, `week`, `month`, `year`. Default: `week`.

**Returns**: `Number`

**Examples**:

```javascript
// Assuming date is 2025-09-18T15:30:45.123-04:00

{{ $now().extract('year') }}
// 2025

{{ $now().extract('month') }}
// 9

{{ $now().extract('day') }}
// 18

{{ $now().extract('hour') }}
// 15

{{ $now().extract('minute') }}
// 30

{{ $now().extract('second') }}
// 45

{{ $('HTTP Request').body.createdAt.extract('year') }}
// Extract creation year
```

---

### format(fmt: TimeFormat)

Formats a date to a specified structure using Luxon formatting tokens.

**Parameters**:
- `fmt` (TimeFormat): Valid string specifying time format. See [Luxon formatting tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).

**Returns**: `String`

**Common Format Tokens**:
- `yyyy` - 4-digit year (2025)
- `yy` - 2-digit year (25)
- `MM` - 2-digit month (01-12)
- `M` - Month (1-12)
- `dd` - 2-digit day (01-31)
- `d` - Day (1-31)
- `HH` - 24-hour format hour (00-23)
- `hh` - 12-hour format hour (01-12)
- `mm` - Minutes (00-59)
- `ss` - Seconds (00-59)
- `a` - AM/PM (am/pm)

**Examples**:

```javascript
{{ $now().format('yyyy-MM-dd') }}
// "2025-09-18"

{{ $now().format('yyyy-MM-dd HH:mm:ss') }}
// "2025-09-18 15:30:45"

{{ $now().format('dd/MM/yyyy') }}
// "18/09/2025"

{{ $now().format('MMM dd, yyyy') }}
// "Sep 18, 2025"

{{ $now().format('HH:mm') }}
// "15:30"

{{ $now().format('hh:mm a') }}
// "03:30 pm"

{{ $('HTTP Request').body.createdAt.format('yyyy-MM-dd') }}
// Format creation date
```

---

### isBetween(date1: Date | DateTime, date2: Date | DateTime)

Checks if a date falls between two specified dates.

**Parameters**:
- `date1` (Date | DateTime): Start date
- `date2` (Date | DateTime): End date

**Returns**: `Boolean`

**Examples**:

```javascript
{{ $now().isBetween('2025-01-01', '2025-12-31') }}
// Check if current date is in 2025

{{ $('HTTP Request').body.eventDate.isBetween(
  $('HTTP Request').body.startDate,
  $('HTTP Request').body.endDate
) }}
// Check if event date is within specified range
```

---

### isInLast(n?: Number, unit?: DurationUnit)

Checks if a date falls within a specified time period (last n units).

**Parameters**:
- `n` (Number, optional): Number of units. For example, enter 9 to check if date is within last 9 weeks. Default: 0
- `unit` (DurationUnit, optional): Valid string specifying time unit. Values: `second`, `minute`, `hour`, `day`, `week`, `month`, `year`. Default: `minute`.

**Returns**: `Boolean`

**Examples**:

```javascript
// Check if within last 7 days
{{ $('HTTP Request').body.createdAt.isInLast(7, 'day') }}

// Check if within last 1 hour
{{ $('HTTP Request').body.lastLogin.isInLast(1, 'hour') }}

// Check if within last 30 minutes
{{ $('HTTP Request').body.timestamp.isInLast(30, 'minute') }}

// Check if within last 3 months
{{ $('HTTP Request').body.orderDate.isInLast(3, 'month') }}
```

---

### isWeekend()

Checks if a date is Saturday or Sunday.

**Returns**: `Boolean`

**Examples**:

```javascript
{{ $now().isWeekend() }}
// Check if today is weekend

{{ $('HTTP Request').body.eventDate.isWeekend() }}
// Check if event date is on weekend

// Use in conditional logic
{{ $('HTTP Request').body.deliveryDate.isWeekend()
  ? 'Weekend delivery surcharge applies'
  : 'Weekday delivery' }}
```

---

### minus(n: Number, unit?: DurationUnit)

Subtracts a specified time period from a date. Returns JavaScript Date or Luxon DateTime depending on input type.

**Parameters**:
- `n` (Number): Number of units. For example, enter 9 to subtract 9 seconds.
- `unit` (DurationUnit, optional): Valid string specifying time unit. Values: `milliseconds` (default), `second`, `minute`, `hour`, `day`, `week`, `month`, `year`.

**Returns**: `Date`

**Examples**:

```javascript
// Subtract days
{{ $now().minus(7, 'day') }}
// 7 days ago

{{ $now().minus(1, 'week') }}
// 1 week ago

{{ $now().minus(3, 'month') }}
// 3 months ago

{{ $now().minus(1, 'year') }}
// 1 year ago

// Subtract hours/minutes
{{ $now().minus(2, 'hour') }}
// 2 hours ago

{{ $now().minus(30, 'minute') }}
// 30 minutes ago

{{ $('HTTP Request').body.expiryDate.minus(7, 'day') }}
// 7 days before expiry date
```

---

### plus(n: Number, unit?: DurationUnit)

Adds a specified time period to a date. Returns JavaScript Date or Luxon DateTime depending on input type.

**Parameters**:
- `n` (Number): Number of units. For example, enter 9 to add 9 seconds.
- `unit` (DurationUnit, optional): Valid string specifying time unit. Values: `milliseconds` (default), `second`, `minute`, `hour`, `day`, `week`, `month`, `year`.

**Returns**: `Date`

**Examples**:

```javascript
// Add days
{{ $now().plus(7, 'day') }}
// 7 days from now

{{ $now().plus(2, 'week') }}
// 2 weeks from now

{{ $now().plus(3, 'month') }}
// 3 months from now

{{ $now().plus(1, 'year') }}
// 1 year from now

// Add hours/minutes
{{ $now().plus(2, 'hour') }}
// 2 hours from now

{{ $now().plus(30, 'minute') }}
// 30 minutes from now

{{ $('HTTP Request').body.startDate.plus(14, 'day') }}
// 14 days after start date
```

## Built-in Date Functions

### $now()

Returns current date and time.

**Examples**:

```javascript
{{ $now() }}
// Current time

{{ $now().format('yyyy-MM-dd') }}
// Today's date

{{ $now().plus(1, 'day').format('yyyy-MM-dd') }}
// Tomorrow's date
```

### $today()

Returns today's date (time set to 00:00:00).

**Examples**:

```javascript
{{ $today() }}
// Today at 00:00:00

{{ $today().format('yyyy-MM-dd') }}
// Today's date
```

## Use Cases

### 1. Date Range Queries

```javascript
// Query last 7 days of data
{{ {
  startDate: $now().minus(7, 'day').format('yyyy-MM-dd'),
  endDate: $now().format('yyyy-MM-dd')
} }}

// Query current month data
{{ {
  startDate: $now().beginningOf('month').format('yyyy-MM-dd'),
  endDate: $now().endOfMonth().format('yyyy-MM-dd')
} }}
```

### 2. Date Formatting

```javascript
// APIs typically need ISO format
{{ $('HTTP Request').body.createdAt.format('yyyy-MM-dd\'T\'HH:mm:ss') }}

// User-friendly display format
{{ $('HTTP Request').body.createdAt.format('MMM dd, yyyy HH:mm') }}
```

### 3. Date Calculations

```javascript
// Calculate expiry date (30 days after purchase)
{{ $('HTTP Request').body.purchaseDate.plus(30, 'day') }}

// Calculate trial end date (14 days after registration)
{{ $('HTTP Request').body.registeredAt.plus(14, 'day') }}

// Calculate reminder time (3 days before deadline)
{{ $('HTTP Request').body.deadline.minus(3, 'day') }}
```

### 4. Date Validation

```javascript
// Check if within valid period
{{ $('HTTP Request').body.currentDate.isBetween(
  $('HTTP Request').body.validFrom,
  $('HTTP Request').body.validUntil
) }}

// Check if recently created
{{ $('HTTP Request').body.createdAt.isInLast(24, 'hour') }}

// Check if weekend
{{ $('HTTP Request').body.deliveryDate.isWeekend() }}
```

### 5. Extract Date Parts

```javascript
// Extract year/month/day for statistics
{{ {
  year: $('HTTP Request').body.orderDate.extract('year'),
  month: $('HTTP Request').body.orderDate.extract('month'),
  day: $('HTTP Request').body.orderDate.extract('day')
} }}

// Group by hour
{{ $('HTTP Request').body.timestamp.extract('hour') }}
```

## Method Chaining

Date methods can be chained:

```javascript
// Get first day of next month
{{ $now()
  .plus(1, 'month')
  .beginningOf('month')
  .format('yyyy-MM-dd') }}

// Get last Monday
{{ $now()
  .minus(1, 'week')
  .beginningOf('week')
  .format('yyyy-MM-dd') }}

// Get same date last year
{{ $('HTTP Request').body.date
  .minus(1, 'year')
  .format('yyyy-MM-dd') }}
```

## Timezone Handling

{{PRODUCT_NAME}} automatically handles timezone conversions. Date and time always include timezone information.

```javascript
// Dates are automatically converted to user timezone
{{ $('HTTP Request').body.utcDate.format('yyyy-MM-dd HH:mm:ss') }}

// Extracted time parts consider timezone
{{ $('HTTP Request').body.utcDate.extract('hour') }}
```

## Best Practices

### 1. Always Format Dates for APIs

```javascript
// Good - Explicit format
{{ $now().format('yyyy-MM-dd') }}

// Bad - Rely on default format
{{ $now() }}
```

### 2. Use Meaningful Time Units

```javascript
// Good - Clear intent
{{ $now().minus(7, 'day') }}

// Bad - Hard to understand
{{ $now().minus(168, 'hour') }}
```

### 3. Handle End of Month Dates

```javascript
// Use endOfMonth instead of hardcoded dates
{{ $now().endOfMonth() }}

// Instead of
{{ $now().plus(30, 'day') }} // Inaccurate
```

### 4. Combine Methods for Precise Times

```javascript
// Get start of current month
{{ $now().beginningOf('month') }}

// Get end of today
{{ $now().beginningOf('day').plus(1, 'day').minus(1, 'millisecond') }}
```

## Common Date Formats

### ISO 8601 Standard

```javascript
{{ $now().format('yyyy-MM-dd\'T\'HH:mm:ss') }}
// "2025-09-18T15:30:45"
```

### US Common Formats

```javascript
{{ $now().format('MM/dd/yyyy') }}
// "09/18/2025"

{{ $now().format('MMM dd, yyyy') }}
// "Sep 18, 2025"
```

### European Common Formats

```javascript
{{ $now().format('dd/MM/yyyy') }}
// "18/09/2025"

{{ $now().format('dd.MM.yyyy') }}
// "18.09.2025"
```

## Related Resources

- [Expressions Overview](/en/guide/expressions)
- [Array Methods](/en/guide/expressions/arrays)
- [String Methods](/en/guide/expressions/strings)
- [Luxon Documentation](https://moment.github.io/luxon/)
- [Code Node](/en/guide/workflow/nodes/action-nodes/code)
