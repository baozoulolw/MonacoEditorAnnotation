import * as Monaco from "monaco-editor";

const register = (monaco: typeof Monaco, options) => {
  const { editor } = monaco;
  editor.addEditorAction({
    id: "generate-annotation",
    label: "自定义命令：生成注释",
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, // 快捷键 Ctrl + D
    ],
    contextMenuGroupId: "navigation", // 可选，放在右键菜单的分组
    contextMenuOrder: 1.5, // 可选，决定菜单中的显示顺序
    run: (editor) => {
      const position = editor.getPosition(); // 获取当前光标位置
      const model = editor.getModel(); // 获取文档模型

      if (model) {
        
        const lineNumber = position?.lineNumber!;
        const lineContent = model.getLineContent(lineNumber);

        console.log("当前行内容：", lineContent);

        // 在此处实现生成注释的逻辑
        editor.executeEdits("", [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            text: `// 这是在第 ${lineNumber} 行生成的注释\n`,
          },
        ]);

        console.log("执行了 command-123");
      }
    },
  });
};
