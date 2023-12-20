import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js', // 入口文件
  output: {
    file: './dist/vue.js',  // 出库文件
    name: 'Vue',
    format: 'umd', // amd: 异步模块定义
    // cjs: CommonJs,适用于Node
    // iife: 一个自动执行的功能，适合适用于script标签这样的,只能在浏览器运行
    // umd: 通用模块定义 以amd cjs iife为一体
    sourcemap: true // 源码调试工具
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      port: 3000, // 端口
      contentBase: '', // 为空表示当前路径
      openPage: '/index.html' //
    })
  ]
}