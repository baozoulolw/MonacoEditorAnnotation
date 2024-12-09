import * as Monaco from "monaco-editor";
import getMethodAtIndex from "./parseAst";
import generateAnnotation from "./generateAnnotation";
interface Options {
  
}

const register = (monaco: typeof Monaco, options: Options) => {
  console.log(options)
  const { editor } = monaco;
  const create = editor.create.bind(editor);
  editor.create = (...args) => {
    const editor = create(...args);
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
      () => {
        const position = editor.getPosition()!; // 获取当前光标位置
        const model = editor.getModel(); // 获取文档模型
        const language = model?.getLanguageId()
        console.log(language)

        if (model) {
          const index = model?.getOffsetAt(position);
          const functionInfo = getMethodAtIndex(index, model.getValue());
          if (!functionInfo) return;
          let { column, line } = functionInfo.start;
          column += 1;
          const texts = generateAnnotation(functionInfo);
          texts.reverse();
          texts.map((text) => {
            editor.executeEdits("", [
              {
                range: new monaco.Range(line, column, line, column),
                text:
                  text +
                  "\n" +
                  Array(column - 1)
                    .fill(" ")
                    .join(""),
              },
            ]);
          });
        }
      }
    );
    return editor;
  };
};

export { register };
