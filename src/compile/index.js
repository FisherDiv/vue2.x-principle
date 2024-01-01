import { parseHTML } from "./parseAst";
import { generate } from "./generate";
// import { generate } from "./generate"
export function compileToFunction(el) {
  // 将html 变成art语法树
  let ast = parseHTML(el);
  // 将ast语法树 生成render() 1.ast语法树变成render字符串 2.字符串变成函数
  let code = generate(ast); // _c: 解析元素 _v:解析文本 _s:解析变量
  // 将render字符串变成函数 code -> function
  let render = new Function(`with(this){return ${code}}`);
  return render;
}
