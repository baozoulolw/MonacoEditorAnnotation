const generateAnnotation = (methodInfo: MethodInfo): string[] => {
  const annotationList = [
    "/**",
    " * @desc ",
    ` * @createTime ${new Date().toLocaleString()}`,
    " * @author Baozoulolw",
  ];
  annotationList.push(
    ...methodInfo.parameters.map((param) => ` * @param {${param}} ${param}`)
  );
  annotationList.push(" * @return");
  annotationList.push(" */");
  return annotationList;
};

export default generateAnnotation;
