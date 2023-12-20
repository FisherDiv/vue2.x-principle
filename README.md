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

# 附: github推送代码
```
cd ~
ls -la .ssh // 查看是否有key,若没有，按以下步骤生成

ssh-keygen -t rsa -C"you_email" // 会生成id_rsa及id_rsa.pub
cat .ssh/id_rsa.pub // 复制里面的内容

- github-> settings-> Develop Keys-> add Key

```

