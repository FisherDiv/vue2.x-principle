# vue2.x-principle
rollup构建项目, vue2.x基本原理

node: v18.15.0
mac

# 初始化项目
```
npm init -y
```

# rollup

```
npm install rollup --save-dev // 打包工具
npm install rollup-plugin-babel --save-dev // 在rollup 中使用babel 插件
npm install  @babel/core --save-dev // babel的核心块
npm install @babel/preset-env --save-dev // babel预设 高级语法转低级
```
- rollup.config.js

# .babelrc
```js
{
    "presets":[
        "@babel/preset-env"
    ]
}
```

# 更改运行指令
```
 "start": "rollup -cw"  // npm run start -c config -w watch
```

