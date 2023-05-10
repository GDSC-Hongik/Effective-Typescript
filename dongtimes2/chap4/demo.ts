// function extent(nums: number[]) {
//   let min, max;

//   for (const num of nums) {
//     if (!min) {
//       min = num;
//       max = num;
//     } else {
//       min = Math.min(min, num);
//       max = Math.max(max, num);
//     }
//   }
//   return [min, max];
// }

// const [min, max] = extent([0, 1, 2]);
// console.log(min, max);

// const extent = (nums: number[]) => {
//   let result: [number, number] | null = null;
//   for (const num of nums) {
//     if (!result) {
//       result = [num, num];
//     } else {
//       result = [Math.min(num, result[0]), Math.max(num, result[1])];
//     }
//   }
//   return result;
// };

// const result = extent([0, 1, 2]);
// if (result) {
//   const [min, max] = result;
//   console.log(min, max);
// }

// interface IMember {
//   name: string;
//   password: string;
//   address: string;
//   type: string; // "normal" or "company"
// }

// const samsung: IMember = {
//   name: "J-Dragon",
//   password: "@#@!fds5",
//   address: "suwon",
//   type: "Company", // 잘못입력!
// };
