import { TraverseOptions, Node } from "@babel/traverse";
import * as t from "@babel/types";
import { MethodInfo } from "../type";

export const getVisiter = (
  codes: string,
  index: number,
  result: MethodInfo[] = []
): TraverseOptions => {
  return {
    ArrowFunctionExpression(nodePath) {
      const parentNode = nodePath.parentPath?.parent;
      let startIndex = 0;
      let endIndex = nodePath.node.end!;
      if (parentNode && parentNode.type === "VariableDeclaration") {
        console.log(parentNode);
        const { start } = parentNode.loc! || {};
        startIndex = start!.index || 0;
        if (index >= startIndex && index <= endIndex) {
          result.push({
            parameters:getParams(nodePath.node.params, codes),
            methodName: '',
            start,end:nodePath.node.loc?.end!,
            isAsync:nodePath.node.async
          })
        }
      }
    },
  };
};

interface Param {
  name: string;
  desc?: string;
  type?: string;
  defaultValue?: any;
}

const getParams = (params: Node[], codes: string) => {
  let paramsArr: Param[] = [];
  params.forEach((param) => {
    paramsArr.push(...getParamsByNode(param, codes));
  });
  return paramsArr
};

const getInfoByNode = (node: Node, params: Param[] = []): Param[] => {
  const { type } = node;
  if (type === "AssignmentPattern") {
    const { left } = node;
    params.push({
      name: (left as t.Identifier).name,
    });
  }
  if (type === "ObjectPattern") {
    const { properties } = node;
    properties.forEach((prop) => {
      getInfoByNode(prop, params);
    });
  }
  if (type === "ArrayPattern") {
    const { elements } = node;
    elements.forEach((element) => {
      getInfoByNode(element!, params);
    });
  }
  if (type === "RestElement") {
    params.push({
      name: (node.argument as t.Identifier).name,
      type: "Array",
    });
  }
  if (type === "Identifier") {
    params.push({
      name: node.name,
    });
  }
  if (type === "ObjectProperty") {
    const { value } = node;
    if (value.type === "Identifier") {
      params.push({
        name: value.name,
      });
    } else {
      getInfoByNode(value, params);
    }
  }
  return params;
};

const getParamsByNode = (
  node: Node,
  codes: string,
  params: Param[] = []
): Param[] => {
  const { type } = node;
  if (type === "AssignmentPattern") {
    const {
      left,
      right: { start, end },
    } = node;
    params.push({
      name: (left as t.Identifier).name,
      defaultValue: codes.slice(start!, end!),
    });
  }
  if (type === "ObjectPattern") {
    const { properties } = node;
    properties.forEach((prop) => {
      getParamsByNode(prop, codes, params);
    });
  }
  if (type === "ArrayPattern") {
    const { elements } = node;
    elements.forEach((element) => {
      getParamsByNode(element!, codes, params);
    });
  }
  if (type === "RestElement") {
    params.push({
      name: (node.argument as t.Identifier).name,
      desc: "",
      type: "Array",
    });
  }
  if (type === "Identifier") {
    params.push({
      name: node.name,
    });
  }
  if (type === "ObjectProperty") {
    const { value } = node;
    if (value.type === "Identifier") {
      params.push({
        name: value.name,
      });
    } else {
      getParamsByNode(value, codes, params);
    }
  }
  return params;
};
