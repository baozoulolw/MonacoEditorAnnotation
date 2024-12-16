import { ParserOptions } from "@babel/parse";
import Dayjs from "dayjs";
interface Position {
  line: number;
  column: number;
  index: number;
}

declare interface Param {
  name: string;
  desc?: string;
  type?: string;
  defaultValue?: any;
}

// 方法信息的类型定义
declare interface MethodInfo extends Snippet {
  methodName: string;
  parameters: Param[];
  isAsync: boolean;
}

declare interface Snippet {
  start: Position;
  end: Position;
}

interface AnnotationOptions {
  jsDoc?: {
    [key: string]: string;
  };
  variable?: {
    [key: string]: string | ((param: VariableParams, value: string) => string);
  };
  dateFormat: string; //日期格式
  useAst?: boolean; // ast解析出错时是否在光标处返回默认注释
  keybinding?: number; //绑定快捷键
}
interface VariableParams {
  methodInfo?: MethodInfo;
  format: (date: Date | string) => string;
  dayjs: typeof Dayjs;
}

declare type ParseLangues = "javascript" | "jsx";
