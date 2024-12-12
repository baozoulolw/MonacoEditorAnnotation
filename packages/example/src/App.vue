<template>
  <div ref="editor" id="editor"></div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import * as monaco from "monaco-editor";
import { register } from "monaco-editor-annotation";
import { useTest } from "./utils";
import traverse, { NodePath, Node } from "@babel/traverse";
import * as t from "@babel/types";

const editorDom = useTemplateRef("editor");
const initEditor = () => {
  register(monaco);
  const editor = monaco.editor.create(editorDom.value!, {
    value: `let b = function(params) {
      
}
function getAge(){
    
}
`,
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true,
  });
  console.log(editor);
  editor.addCommand(
    monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM,
    () => {
      const result = useTest(editor);
      const codes = editor.getValue();
      if (!result) return;
      const { ast, index } = result;
      traverse(ast, {
        FunctionDeclaration(node) {
          console.log("FunctionDeclaration", node);
        },
        FunctionExpression(node) {
          console.log("FunctionExpression", node);
        },
        ObjectMethod(node) {
          console.log("ObjectMethod", node, 2);
        },
        ArrowFunctionExpression(nodePath) {
          console.log("ArrowFunctionExpression", nodePath)
          const parentNode = nodePath.parentPath?.parent;
          let startIndex = 0;
          let endIndex = nodePath.node.end;
          console.log(nodePath.node.params);
          getParams(nodePath.node.params, codes);
          if (parentNode && parentNode.type === "VariableDeclaration") {
            console.log(parentNode);
            const { start, end } = parentNode.loc || {};
            startIndex = start!.index || 0;
          }
        },
      });
    }
  );

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
    console.log(paramsArr);
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
};
onMounted(() => {
  initEditor();
});
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
#editor {
  width: 100vw;
  height: 100vh;
}
</style>
