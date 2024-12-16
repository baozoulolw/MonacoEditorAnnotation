import { AnnotationOptions } from "../type";
import { merge } from "lodash";
import * as Monaco from "monaco-editor";

// 默认支持的语言
const supportLanguages = ["javascript", "typescript"];

// 默认配置
const defaultOptions: AnnotationOptions = {
  jsDoc: {
    description: '',
    author: '${author}',
    date: '${date}',
    param: '{${param.type}} ${param.name} ${param.defaultValue}',
    return: '{*}',
  },
  variable: {
    author: 'Baozoulolw',
    date: ({ format }) => format(new Date()),
    'param.type': (_p, value) => value || '*',
    'param.defaultValue': (_p, value) => (value ? `defaultValue:${value}` : ''),
  },
  dateFormat: 'YYYY-MM-DD HH:mm:ss', // 日期格式化
  useAst: true, // 是否不走ast解析直接生成注释
  //keybinding: 4 | KeyMod.CtrlCmd | 42,
};

let options: AnnotationOptions = defaultOptions;

/**
 * @description: 设置配置
 * @Date: 2024-12-15 22:20:10
 * @Author: 王浩然
 * @param {Options} setOption
 * @return {*}
 */
const setOptions = (
  setOption: AnnotationOptions,
  monaco: typeof Monaco
): void => {
  options = merge(
    options,
    {
      keybinding:
        monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
    },
    setOption
  );
};

export { options, setOptions, supportLanguages };
