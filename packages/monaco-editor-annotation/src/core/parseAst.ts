import { editor } from "monaco-editor";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { MethodInfo } from "../type";

export default async function getMethodAtIndex(
  editor: editor.IStandaloneCodeEditor,
  index: number,
  code: string
): Promise<MethodInfo | undefined> {
  let resolve: any;
  const promise = new Promise<MethodInfo | undefined>((res) => (resolve = res));
  // 1. 解析代码生成 AST
  try {
    const ast = parse(code, {
      sourceType: "module", // 设置源码类型，通常是 'module' 或 'script'
      plugins: ["jsx", "typescript"], // 如果你的代码中包含 JSX, 启用这个插件
    });
    const { getVisiter } = await import("../parser/javascript");
    const result: MethodInfo[] = [];
    traverse(ast, getVisiter(editor.getValue(), index, result));
    resolve(result[result.length - 1]);
  } catch (e) {
    resolve(e);
  }
  return promise;
}
