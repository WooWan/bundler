
// Module: /Users/uchang-wan/Desktop/wan/study/bundler/src/index.js
;
;

console.log(myFunction());
console.log("Name: ", NAME);
console.log("Country: ", COUNTRY);
const test = "hello";

// Module: /Users/uchang-wan/Desktop/wan/study/bundler/src/constants.js
export const NAME = "FERNANDO DOGLIO";
export const COUNTRY = "SPAIN";

// Module: /Users/uchang-wan/Desktop/wan/study/bundler/src/functions.js
;

export function myFunction() {
  return "this is my function";
}

export function secondaryFunction() {
  return {
    name: NAME,
    id: 123,
  };
}
