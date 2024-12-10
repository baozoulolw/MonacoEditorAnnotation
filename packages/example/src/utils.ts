import { parse } from "@babel/parser";
import { editor } from "monaco-editor";
export const useTest = (
  editor: editor.IStandaloneCodeEditor
): ReturnType<typeof parseContent> | null => {
  const position = editor.getPosition()!; // 获取当前光标位置
  const model = editor.getModel()!;
  if (!model) return null;
  let line = position.lineNumber;
  let content = model.getLineContent(line);
  let ast: ReturnType<typeof parseContent> | null = parseContent(content);
  while (!ast && line < model.getLineCount()) {
    debugger;
    content += "\n" + model.getLineContent(++line);
    ast = parseContent(content);
  }
  return ast;
};

const parseContent = (content: string): ReturnType<typeof parse> | null => {
  let ast: ReturnType<typeof parse> | null = null;
  try {
    ast = parse(content, { sourceType: "script" });
  } catch (e) {}
  return ast;
};
