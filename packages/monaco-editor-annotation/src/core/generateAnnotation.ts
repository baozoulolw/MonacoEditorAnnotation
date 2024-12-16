import { AnnotationOptions, MethodInfo } from "../type";
import { options } from "../options";
import { keys, mapKeys, difference } from "lodash";
import dayjs from "dayjs";

const generateAnnotation = (methodInfo: MethodInfo): string[] => {
  const list = generate(methodInfo);
  return list;
};

const generate = (methodInfo: MethodInfo): string[] => {
  const annotationList = ["/**"];
  const { jsDoc } = options;
  const defaultValue = {
    methodName: "",
  };
  const variables = {
    ...defaultValue,
    ...options.variable,
  };
  keys(jsDoc!).forEach((key) => {
    if (key === "param") {
      if (methodInfo.parameters.length) {
        annotationList.push(
          ...methodInfo.parameters.map((param) => {
            return ` * @${key} ${replaceVariables(
              jsDoc![key],
              {
                ...variables,
                ...mapKeys(param, (_v, k) => `param.${k}`),
              },
              mapKeys(param, (_v, k) => `param.${k}`),
              methodInfo
            )}`;
          })
        );
      }
    } else {
      annotationList.push(
        ` * @${key} ${replaceVariables(
          jsDoc![key],
          variables,
          defaultValue,
          methodInfo
        )}`
      );
    }
  });
  annotationList.push(" */");
  return annotationList;
};

const generateDefaultAnnotation = (): string[] => {
  const defaultValue = {
    methodName: "",
  };
  const variables = {
    ...defaultValue,
    ...options.variable,
  };
  const annotationList = ["/**"];
  const { jsDoc } = options;
  difference(keys(jsDoc!), ['param']).forEach((key) => {
    annotationList.push(
      ` * @${key} ${replaceVariables(jsDoc![key], variables, defaultValue)}`
    );
  });
  annotationList.push(" */");
  return annotationList;
};

const replaceVariables = (
  template: string,
  variable: NonNullable<AnnotationOptions["variable"]>,
  defaultValue: Record<string, string>,
  methodInfo?: MethodInfo
) => {
  // 使用正则匹配 ${...} 格式的占位符
  return template.replace(/\$\{([\w.]+)\}/g, (match, key) => {
    if (key in variable) {
      const value = variable[key];
      // 判断值是字符串还是方法
      return typeof value === "function"
        ? value(
            {
              methodInfo,
              dayjs,
              format: (date) => dayjs(date).format(options.dateFormat),
            },
            defaultValue[key] || ""
          )
        : value;
    }
    // 如果 key 不在 variable 中，保留原样
    return match;
  });
};

export { generateAnnotation, generateDefaultAnnotation };
