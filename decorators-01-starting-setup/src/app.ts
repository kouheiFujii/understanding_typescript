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
  return function (constructor: any) {
    console.log("CALL WithTemplate");
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = "<h1></h1>";
      hookEl.querySelector("h1")!.textContent = p.name;
    }
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
function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator");
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
  private _price: number;

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

  getPriceWithTax(tax: number) {
    return this._price * tax;
  }
}
