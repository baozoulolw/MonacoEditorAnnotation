import { expect, test } from "vitest";
import getMethodAtIndex from "../src/core/parseAst";

test("parse", () => {
  const code = `let getan = function(){}
  getName:() => {};
  function getKey(){};
  let b = () => {};
  `;
  const info = getMethodAtIndex(23, code);
  console.log(info);
});

let getan = function(){}
  getName:() => {};
  function getKey(){};
  let b = () => {};
