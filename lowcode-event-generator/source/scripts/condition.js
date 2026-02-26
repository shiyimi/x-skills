
// 条件判断 (condition)
// 使用标准的 if-else if-else 结构
// 支持的操作符: ==, !=, >, <, >=, <=, .includes, !.includes, lodash.isEmpty, !lodash.isEmpty

// 1. 简单判断
if (value > 100) {
  // TODO: 处理逻辑
}

// 2. 复杂判断
if (value > 100 && status === 'active') {
  // TODO: 处理逻辑
} else if (value < 0) {
  // TODO: 处理逻辑
} else {
  // TODO: 处理逻辑
}

// 3. 判空 (使用 lodash)
// 为空
if (typeof value === 'object' ? lodash.isEmpty(value) : !value) {
  // TODO: 处理逻辑
}
// 不为空
if (typeof value === 'object' ? !lodash.isEmpty(value) : !!value) {
  // TODO: 处理逻辑
}

// 4. 包含判断
if (list.includes(item)) {
  // TODO: 处理逻辑
}
