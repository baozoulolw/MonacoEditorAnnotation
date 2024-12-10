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
    value: `let b = (a = window.onload,{n},[m],...c) => {}`,
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true,
  });
  console.log(editor);
  editor.addCommand(
    monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM,
    () => {
      const result = useTest(editor);
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
          const parentNode = nodePath.parentPath?.parent;
          let startIndex = 0;
          let endIndex = nodePath.node.end;
          console.log(nodePath.node.params);
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
    desc: string;
    defaultValue: any;
    type: string;
  }

  const getParams = (params: Node[]) => {
    let paramsArr: Param[] = [];
    params.forEach((param) => {
      const { type } = param;
      // a = 123 有默认值
      if (type === "AssignmentPattern") {
        const { left, right } = param;
        paramsArr.push({
          name: left.name,
          desc: "",
          defaultValue: right.value,
          type: right.type,
        });
      }
      // {a,b} 解构
      if (type === "ObjectPattern") {
      }
      // ...n 剩余参数
      if (type === "RestElement") {
      }
    });
  };

  const getInfoByNode = (node: Node, params: Param[] = []): Param[] => {
    const { type } = node;
    if (type === "AssignmentPattern") {
      const { left, right } = node;
      params.push({
        name: (left as t.Identifier).name,
        desc: "",
        defaultValue: right.value,
        type: right.type,
      });
    }
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
