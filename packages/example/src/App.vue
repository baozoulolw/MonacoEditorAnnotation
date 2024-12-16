<template>
  <div ref="editor" id="editor"></div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import * as monaco from "monaco-editor";
import { register } from "monaco-editor-annotation";

const editorDom = useTemplateRef("editor");
const initEditor = () => {
  register(monaco,{
    useAst:false
  });
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
