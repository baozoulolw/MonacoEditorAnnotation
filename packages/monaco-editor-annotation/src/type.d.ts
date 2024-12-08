interface Position {
  line: number;
  column: number;
  index: number;
}

// 方法信息的类型定义
declare interface MethodInfo {
  start: Position;
  startIndex: number;
  methodName: string;
  parameters: string[];
  isAsync: boolean;
}
