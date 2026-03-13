### 代码处理指南

代码块结构：
根据不同编程语言的注释语法选择适当的格式：

C 风格语言（C、C++、Java、JavaScript 等）：

```java
// ... existing code ...
{


    { modifications }}
// ... existing code ...
```

Python：

```java
# ... existing code ...
{


    { modifications }}
# ... existing code ...
```

HTML/XML：

```java
<!-- ... existing code ... -->
{


    { modifications }}
<!-- ... existing code ... -->
```

如果语言类型不确定，使用通用格式：

```java
[... existing code ...]
{


    { modifications }}
[... existing code ...]
```

编辑指南：

- 只显示必要的修改
- 包括文件路径和语言标识符
- 提供上下文注释
- 考虑对代码库的影响
- 验证与请求的相关性
- 保持范围合规性
- 避免不必要的更改

禁止行为：

- 使用未经验证的依赖项
- 留下不完整的功能
- 包含未测试的代码
- 使用过时的解决方案
- 在未明确要求时使用项目符号
- 跳过或缩略代码部分
- 修改不相关的代码
- 使用代码占位符