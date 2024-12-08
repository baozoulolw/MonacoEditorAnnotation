import { expect, test } from "vitest";
import getMethodAtIndex from "../src/core/parseAst";

test("parse", () => {
  const code = `let a = {
  methods:{
    getRender(){
    },
    geta:function(){
    },
    async geth(){
    },
    getj(){
      return '123'
    }
  }
}
let getan = function(){
  
}`;
  const info = getMethodAtIndex(162, code);
  console.log(info);
});

let a = function(){
  
}
