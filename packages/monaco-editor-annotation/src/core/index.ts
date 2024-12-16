import * as Monaco from "monaco-editor";
import getMethodAtIndex from "./parseAst";
import {
  generateAnnotation,
  generateDefaultAnnotation,
} from "./generateAnnotation";
import { AnnotationOptions } from "../type";
import { supportLanguages, setOptions, options } from "../options";

const register = (monaco: typeof Monaco, paramOptions: AnnotationOptions) => {
  setOptions(paramOptions,monaco); // 更新配置
  const { editor } = monaco;
  const create = editor.create.bind(editor);
  editor.create = (...args) => {
    const editor = create(...args);
    editor.addCommand(
      options.keybinding!,
      async () => {
        const position = editor.getPosition()!; // 获取当前光标位置
        const model = editor.getModel(); // 获取文档模型
        const language = model?.getLanguageId();
        // 校验是否是支持语言
        if (supportLanguages.includes(language!) && options.useAst) {
          if (model) {
            const index = model?.getOffsetAt(position);
            const functionInfo = await getMethodAtIndex(
              editor,
              index,
              model.getValue()
            );
            console.log(functionInfo)
            if (!functionInfo) return;
            let { column, line } = functionInfo.start;
            column += 1;
            const texts = generateAnnotation(functionInfo);
            addCode(monaco, editor, line, column, texts);
          }
        } else {
          const texts = generateDefaultAnnotation();
          addCode(monaco, editor, position.lineNumber, position.column, texts);
        }
      }
    );
    return editor;
  };
};

const addCode = (
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor,
  line: number,
  column: number,
  texts: string[]
) => {
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
};

export { register };
