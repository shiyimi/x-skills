
// 消息提示 (message)
// 显示顶部提示信息
// duration: 延时关闭时间（秒），0 表示不自动关闭
message.info('提示内容', 3);
message.success('成功内容', 3);
message.warning('警告内容', 3);
message.error('错误内容', 3);

// 通知提醒 (notification)
// 显示右侧通知框
showNotification({
  type: 'info', // info | success | warning | error
  title: '通知标题',
  content: '通知内容',
  detailContent: '详细内容（可选）',
  duration: 3 // 延时关闭时间（秒）
});
