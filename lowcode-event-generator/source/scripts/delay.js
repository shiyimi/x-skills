
// 延时执行 (delay)
// 支持 setTimeout 和 setInterval

// 1. 延时执行 (setTimeout)
// delay: 延时时间（毫秒）
setTimeout(() => {
  // TODO: 延时后执行的逻辑
  message.info('延时结束');
}, 1000);

// 2. 定时重复执行 (setInterval)
// 无次数限制
setInterval(() => {
  // TODO: 定时执行的逻辑
  console.log('定时执行');
}, 3000);

// 3. 定时重复执行 (带次数限制)
// maxExecutions: 最大执行次数
let executionCount = 0;
const intervalId = setInterval(() => {
  executionCount++;
  // TODO: 定时执行的逻辑
  console.log(`执行第 ${executionCount} 次`);
  
  if (executionCount >= 5) {
    clearInterval(intervalId);
  }
}, 1000);
