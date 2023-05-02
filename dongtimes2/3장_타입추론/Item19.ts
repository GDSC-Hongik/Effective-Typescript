const a: number = 10;

const myInfo1: {
  name: string;
  age: number;
  born: string;
} = {
  name: "yudongha",
  age: 7,
  born: "Seoul",
}; // bad

const myInfo = {
  name: "yudongha",
  age: 7,
  born: "Seoul",
};

const square = (arr: number[]) => {
  return arr.map((num) => num * num);
};

const x = "y";
let y = "y";

// const cache: { [item: string]: number } = {
//   a: 11,
//   b: 22,
//   c: 33,
// };

const cache = {
  a: 11,
  b: 22,
  c: 33,
};

// let index = "a";
// console.log(cache[index]);
// console.log(cache["d"]);

// let id;
// id = "abc";
// id = 123;

// let id: string | number = "abc";
// id = 123;

// let key = "x";
// const vector = { x: 10, y: 20, z: 30 };
// // console.log(vector[key]);

// let mix = [111, "aaa"];

const axis = "x";
const vector = { x: 10, y: 20, z: 30 } as const;
// vector.y = 50;

const obj: { x: 1 | 2 | 3 } = {
  x: 1,
};

obj.x = 3;
// console.log(vector[axis]);

const temp = /.exe$/;
const temp2 = "hello";

console.log(temp instanceof RegExp);
// console.log(temp2 instanceof RegExp);

const aa = (x?: number | string | null) => {
  if (!x) {
    console.log(x);
  }
};

// const isString = (test: any): test is string => {
//   return typeof test === "string";
// };

const isString = (test: any): test is string => {
  return typeof test === "string";
};

const text = "abc";

const foo = (target: any) => {
  if (isString(target)) {
    console.log(target.length);
  }
};

foo(text);

declare let hasMiddle: boolean;
const firstLast = { first: "Harry", last: "Truman" };
const president = { ...firstLast, ...(hasMiddle ? { middle: "S" } : {}) };

declare let hasDates: boolean;
const nameTitle = { name: "NAME", title: "Title" };
const pharaoh = {
  ...nameTitle,
  ...(hasDates ? { start: 1111, end: 2222 } : {}),
};
