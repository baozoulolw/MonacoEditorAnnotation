<template>
  <div ref="editor" id="editor"></div>
</template>

<script setup>
import { onMounted,useTemplateRef } from "vue";
import * as monaco from 'monaco-editor'
import { register } from "monaco-editor-annotation";

const editorDom = useTemplateRef('editor')

const initEditor = () => {
  register(monaco)
  monaco.editor.create(editorDom.value, {
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
}
onMounted(() => {
  initEditor()
});
</script>
<style lang="scss">
*{
  padding: 0;
  margin: 0;
}
#editor{
  width: 100vw;
  height: 100vh;
}
</style>
