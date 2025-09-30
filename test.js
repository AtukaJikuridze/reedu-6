// 1) ჯერ console.log("one"), console.log("two") და მერე ფუნქცია
function block() {
  for (let i = 1; i < 1000000000; i++) {}
}

console.log("one");
console.log("two");

// პრომისით ასინქრონულში გადავდოთ
new Promise((resolve) => {
  setTimeout(() => {
    block();
    resolve();
  }, 0);
}).then(() => console.log("block finished"));

// 2) ორი პრომისი - ერთი resolve, ერთი reject
let p1 = new Promise((resolve) => resolve("Success"));
let p2 = new Promise((_, reject) => reject("Error"));

// ცალცალკე დამუშავება
p1.then((res) => console.log("p1:", res)).catch((err) =>
  console.error("p1:", err)
);
p2.then((res) => console.log("p2:", res)).catch((err) =>
  console.error("p2:", err)
);

// ჯგუფურად allSettled
Promise.allSettled([p1, p2]).then((results) => {
  console.log("allSettled:", results);
});

// 3) 4 პრომისი, დავაბრუნოთ მხოლოდ პირველი resolved
let pr1 = new Promise((_, reject) => setTimeout(() => reject("Fail 1"), 100));
let pr2 = new Promise((resolve) => setTimeout(() => resolve("Win 2"), 200));
let pr3 = new Promise((_, reject) => setTimeout(() => reject("Fail 3"), 50));
let pr4 = new Promise((resolve) => setTimeout(() => resolve("Win 4"), 300));

Promise.any([pr1, pr2, pr3, pr4])
  .then((res) => console.log("First resolved:", res))
  .catch((err) => console.error("All failed:", err));

// 4) 4 პრომისი და რედიუსით დავითვალოთ რამდენია წარმატებული და რამდენი წარუმატებელი
let promises4 = [
  Promise.resolve("ok1"),
  Promise.reject("bad1"),
  Promise.resolve("ok2"),
  Promise.reject("bad2"),
];

Promise.allSettled(promises4).then((results) => {
  let stats = results.reduce(
    (acc, res) => {
      if (res.status === "fulfilled") acc.success++;
      else acc.fail++;
      return acc;
    },
    { success: 0, fail: 0 }
  );
  console.log("Stats:", stats);
});

// 5) 5 პრომისი, გაფილტრო მხოლოდ წარუმატებლები
let promises5 = [
  Promise.resolve("ok1"),
  Promise.reject("bad1"),
  Promise.resolve("ok2"),
  Promise.reject("bad2"),
  Promise.reject("bad3"),
];

Promise.allSettled(promises5).then((results) => {
  let failed = results.filter((r) => r.status === "rejected");
  console.log("Only failed:", failed);
});

// 6) ორი API ერთად
let api1 = fetch("https://jsonplaceholder.typicode.com/users").then((r) =>
  r.json()
);
let api2 = fetch("https://jsonplaceholder.typicode.com/posts").then((r) =>
  r.json()
);

Promise.all([api1, api2])
  .then(([users, posts]) => {
    console.log("Users:", users.slice(0, 2)); // 2 user
    console.log("Posts:", posts.slice(0, 2)); // 2 post
  })
  .catch((err) => console.error("Error:", err));
