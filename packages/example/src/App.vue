<template>
  <div ref="editor" id="editor"></div>
</template>

<script setup lang="ts">
import { onMounted,useTemplateRef } from "vue";
import * as monaco from 'monaco-editor'
import { register } from "monaco-editor-annotation";

const editorDom = useTemplateRef('editor')

const initEditor = () => {
  register(monaco)
  const editor = monaco.editor.create(editorDom.value, {
    value:`let a = {
  methods:{
    getRender(){
    },
    geta:function(){
    },
    async geth(){
    },
    getj(){
      return '123'
    }
  }
}`,
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true
  })
  console.log(editor)
  editor.addCommand(
    monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM,
    () => {
      const position = editor.getPosition()!; // 获取当前光标位置
      const model = editor.getModel(); // 获取文档模型
      console.log(model)
      console.log(position)
    }
  )

}
onMounted(() => {
  initEditor()
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
