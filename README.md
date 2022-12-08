## 解决问题

1. 异常捕获，支持同步和异步

```js
try {
   // 一堆逻辑
   
   try {
    // 一堆逻辑
   } catch() {

   }
} catch() {

}
```
到处写， 且嵌套层级过深不易读

2.异步方法调用，常出现竞态返回的问题

3.小巧、总代码量不到 60 行， 无依赖


```js
import { run } from "@aimwhy/run";

function delay(ms, value) {
   return new Promise((res) => window.setTimeout(res, ms, value))
}

async function test(ms, v) {
   let [err, val] = await run(delay, [ms, v], true);

   if(err && err.isRace) {
      return console.warn('已被抢占')
   }

   console.log(val)
}

test(3000, 3)

setTimeout(() => {
   test(1000, 1)
})

```


```js
import { run } from "@aimwhy/run";

function test(a) {
  console.log(a)
  throw new Error('test');
}

let [err, data] = run(test, [22]);

if (err) {
  return console.log(err);
}

console.log(data);

```