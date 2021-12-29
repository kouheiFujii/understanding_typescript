type Lengthy = {
  length: number;
};

function countAndDescribe<T extends Lengthy>(element: T) {
  let descriptionText = "Got no value";
  // type で指定しつつ length メソッドも使うという高等技
  if (element.length === 1) {
    descriptionText = "Got 1 element";
  } else {
    descriptionText = `Got ${element.length} element`;
  }

  return [element, descriptionText];
}

// console.log(countAndDescribe("hello"));

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return "Value:" + obj[key];
}

// name か ageは許容されるがそれ以外は NG になる
console.log(extractAndConvert({ name: "Kouhei", age: 30 }, "age"));
