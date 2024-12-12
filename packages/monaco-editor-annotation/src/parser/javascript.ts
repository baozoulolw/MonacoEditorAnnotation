import { TraverseOptions, Node } from "@babel/traverse";
import * as t from "@babel/types";
import { MethodInfo, Position } from "../type";

export const getVisiter = (
  codes: string,
  index: number,
  result: MethodInfo[] = []
): TraverseOptions => {
  return {
    ArrowFunctionExpression(nodePath) {
      let start: Position;
      const end = nodePath.node.loc?.end!;
      let methodName: string = "";
      if (nodePath.key === "value") {
        start = nodePath.parent.loc?.start!;
        methodName = ((nodePath.parent as t.ObjectProperty).key as t.Identifier)
          .name;
      } else {
        start = nodePath.parentPath.parent.loc?.start!;
        if (nodePath.parent.type === "Identifier") {
          methodName = nodePath.parent.name;
        }
      }
      if (index >= start.index && index <= end.index) {
        result.push({
          parameters: getParams(nodePath.node.params, codes),
          methodName,
          start,
          end,
          isAsync: nodePath.node.async,
        });
      }
    },
    FunctionDeclaration(nodePath) {
      const { start, end } = nodePath.node.loc!;
      const startIndex = start.index || 0;
      const endIndex = end.index || 0;
      if (index >= startIndex && index <= endIndex) {
        result.push({
          parameters: getParams(nodePath.node.params, codes),
          methodName: nodePath.node.id!.name,
          start,
          end,
          isAsync: nodePath.node.async,
        });
      }
    },
    FunctionExpression(nodePath) {
      let start: Position;
      const end = nodePath.node.loc?.end!;
      let methodName: string = "";
      if (nodePath.key === "value") {
        start = nodePath.parent.loc?.start!;
        methodName = ((nodePath.parent as t.ObjectProperty).key as t.Identifier)
          .name;
      } else {
        start = nodePath.parentPath.parent.loc?.start!;
        if (nodePath.parent.type === "Identifier") {
          methodName = nodePath.parent.name;
        }
      }
      if (index >= start.index && index <= end.index) {
        result.push({
          parameters: getParams(nodePath.node.params, codes),
          methodName,
          start,
          end,
          isAsync: nodePath.node.async,
        });
      }
    },
    ObjectMethod(nodePath) {
      const { start, end } = nodePath.node.loc!;
      if (index >= start.index && index <= end.index) {
        result.push({
          parameters: getParams(nodePath.node.params, codes),
          methodName: (nodePath.node.key as t.Identifier).name || "",
          start,
          end,
          isAsync: nodePath.node.async,
        });
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
  return paramsArr;
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
