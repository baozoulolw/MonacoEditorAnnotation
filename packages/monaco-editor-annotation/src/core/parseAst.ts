import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export default function getMethodAtIndex(
  index: number,
  code: string
): MethodInfo | null {
  // 1. 解析代码生成 AST
  const ast = parse(code, {
    sourceType: "module", // 设置源码类型，通常是 'module' 或 'script'
    plugins: ["jsx"], // 如果你的代码中包含 JSX, 启用这个插件
  });

  let methodInfo: MethodInfo | null = null;
  // let a = {
  //   methods:{
  //     getRender(){
  //     },
  //     geta:function(){
  //     },
  //     async geth(){
  //     },
  //     getj(){
  //       return '123'
  //     }
  //   }
  // }

  // 2. 遍历 AST 查找方法
  traverse(ast, {
    FunctionDeclaration(path) {
      const { start, end } = path.node.loc || {};
      if (start && end && index >= start.index && index <= end.index) {
        // 获取方法名、参数、是否为 async 函数
        methodInfo = {
          start,
          startIndex: start.index,
          methodName: path.node.id?.name || "anonymous",
          parameters: getParameterNames(path.node.params),
          isAsync: path.node.async,
        };
      }
    },
    FunctionExpression(path: any) {
      const { start, end } = path.node.loc || {};
      if (start && end && index >= start.index && index <= end.index) {
        methodInfo = {
          start: path.parent.key ? path.parent.key.loc.start : start,
          startIndex: start.index,
          methodName: path.node.id ? path.node.id.name : "anonymous",
          parameters: getParameterNames(path.node.params),
          isAsync: path.node.async,
        };
      }
    },
    ArrowFunctionExpression(path) {
      const { start, end } = path.node.loc || {};
      if (start && end && index >= start.index && index <= end.index) {
        methodInfo = {
          start,
          startIndex: start.index,
          methodName: "anonymous", // 箭头函数没有名称
          parameters: getParameterNames(path.node.params),
          isAsync: path.node.async,
        };
      }
    },
    ObjectMethod(path) {
      const { start, end } = path.node.loc || {};
      // 判断光标是否在对象方法内部
      if (start && end && index >= start.index && index <= end.index) {
        methodInfo = {
          start,
          startIndex: start.index,
          methodName: "anonymous",
          parameters: getParameterNames(path.node.params),
          isAsync: path.node.async,
        };
      }
    },
  });

  // 3. 返回方法信息
  return methodInfo;
}

// 获取参数的名称，处理 ArrayPattern 和 RestElement 等特殊类型
function getParameterNames(params: any[]): string[] {
  const names: string[] = [];

  params.forEach((param) => {
    if (param.type === "Identifier") {
      // 普通的标识符（即变量名）
      names.push(param.name);
    } else if (param.type === "ArrayPattern") {
      // 处理数组解构
      param.elements.forEach((element: { type: string; name: string }) => {
        if (element && element.type === "Identifier") {
          names.push(element.name);
        }
      });
    } else if (param.type === "RestElement") {
      // 处理剩余参数（...args）
      if (param.argument && param.argument.type === "Identifier") {
        names.push(param.argument.name);
      }
    } else if (param.type === "ObjectPattern") {
      // 处理对象解构
      param.properties.forEach(
        (prop: { key: { type: string; name: string } }) => {
          if (prop.key && prop.key.type === "Identifier") {
            names.push(prop.key.name);
          }
        }
      );
    }
  });

  return names;
}
