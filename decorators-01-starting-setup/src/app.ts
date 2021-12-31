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

function AutoBind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor) {
  // descriptor.value でメソッドにアクセス可能
  const originalMethod = descriptor.value;
  // PropertyDescriptor のプロパティを上書きしている
  const adjMethod = {
    // コメントアウトしても動く
    configable: true,
    // コメントアウトしても動く
    enumable: false,
    get() {
      // javascript の bind メソッドで this を縛る
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjMethod;
}
class Printer {
  message = "This works!";
  @AutoBind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector("button")!;
button.addEventListener("click", p.showMessage);

// -----
interface ValidatorConfig {
  // [] でキー側の型を指定している
  [property: string]: {
    [validatableProp: string]: string[]; // ["required", "positive"]
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    // registeredValidatorsに値が入っていればスプレッド構文で配合
    ...registeredValidators[target.constructor.name],
    [propName]: ["required"],
    // なにやってるかわからん
    // [propName]: [
    //   ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
    //   "required",
    // ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    // registeredValidatorsに値が入っていればスプレッド構文で配合
    ...registeredValidators[target.constructor.name],
    [propName]: ["positive"],
    // なにやってるかわからん
    // [propName]: [
    //   ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
    //   "positive",
    // ],
  };
}

function validate(obj: any) {
  // constructor.name にアクセスするとクラス名が取得できる
  // Validators の中から該当するclassを指定。
  const validatorConfig = registeredValidators[obj.constructor.name];

  if (!validatorConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in validatorConfig) {
    for (const validator of validatorConfig[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Cource {
  @Required
  title: string;
  @PositiveNumber
  price: number;
  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courceForm = document.querySelector("form")!;

courceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  // HTMLInputElement は string 型なので + を追記すると number 型に推論してくれる
  const price = +priceEl.value;

  const createCource = new Cource(title, price);

  if (!validate(createCource)) {
    alert("Invalid input, please try again!");
    return;
  }
  console.log(createCource);
});
