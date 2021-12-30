function Logger(logString: string) {
  console.log("Definition Logger");
  return function (constructor: Function) {
    console.log("CALL Logger");
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(hookId: string) {
  console.log("Definition WithTemplate");
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    // 新しいクラスを作成
    return class extends originalConstructor {
      constructor(..._: any[]) {
        // 継承しているので super 必要
        super();
        // クラスを継承しているのでロジックの移動が可能
        console.log("CALL WithTemplate");
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = "<h1></h1>";
          // 継承したクラスの this を指定
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

@Logger("LOGGING - Person")
@WithTemplate("app")
class Person {
  name = "Max";
  constructor() {
    console.log("create person");
  }
}

const person = new Person();

// ------

// target = @Log直下。この例でいうと target = title
// propertyName = class 内の関数。この例でいうと propertyName = getPriceWithTax
// property 直下に置けばその値のログが見れる
function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator");
  console.log(target, propertyName);
}

// Accessor の値を取得する
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Method の値を取得する
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// 引数の値と対応する ポジションが分かる
function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Parameter decorator");
  console.log(target);
  console.log(name);
  console.log(position); // 0
}
class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid value!");
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * tax;
  }
}
