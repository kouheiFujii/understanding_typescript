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

// @WithTemplate("app")
// class Animal {
//   name = "Pochi";
//   constructor() {
//     console.log("create animal");
//   }
// }
// const animal = new Animal();
