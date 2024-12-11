import { ParserOptions } from "@babel/parse";
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

declare interface AnnotationOptions {
  babelConfig: ParserOptions;
}

interface BabelConfig {
  plugins: ParseLangues[];
}

declare type ParseLangues = "javascript" | "jsx";
