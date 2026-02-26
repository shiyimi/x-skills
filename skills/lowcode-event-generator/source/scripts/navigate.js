
// 页面跳转 (navigate)

// 1. 内部路由跳转 (React Router)
// 使用 history.push 跳转到内部页面
history.push("/other-page");
history.push("/other-page?id=123"); // 带参数

// 2. 外部链接跳转
// 新窗口打开
window.open("https://www.example.com");

// 当前窗口打开
window.location.href = "https://www.example.com";
