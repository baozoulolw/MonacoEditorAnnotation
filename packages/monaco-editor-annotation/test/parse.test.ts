import { expect, test } from "vitest";
import getMethodAtIndex from "../src/core/parseAst";
import { parse } from "@babel/parser";

// test("parse", () => {
//   const code = `let getan = function(){}
//   getName:() => {};
//   function getKey(){};
//   let b = () => {};
//   `;
//   const info = getMethodAtIndex(23, code);
//   console.log(info);
// });

test("parseAst", () => {
  const code = `
  
  let getan = function(){
  }`;
  let info
  try{
    info = parse(code)
  }catch(e){
    
  }
  console.log(info);
});
