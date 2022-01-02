// validatable
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatable) {
  let isValid = true;

  if (validatable.required) {
    isValid = isValid && validatable.value.toString().trim().length !== 0;
  }
  if (validatable.minLength != null && typeof validatable.value === "string") {
    isValid = isValid && validatable.value.length >= validatable.minLength;
  }
  if (validatable.maxLength != null && typeof validatable.value === "string") {
    isValid = isValid && validatable.value.length <= validatable.maxLength;
  }
  if (validatable.min != null && typeof validatable.value === "number") {
    isValid = isValid && validatable.value >= validatable.min;
  }
  if (validatable.max != null && typeof validatable.value === "number") {
    isValid = isValid && validatable.value <= validatable.max;
  }

  return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    // true の記載推奨
    configurable: true,
    get() {
      const boundFn = originMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  inputTitleElement: HTMLInputElement;
  inputDescriptionElement: HTMLInputElement;
  inputPeopleElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;
    this.hostElement = document.getElementById("app") as HTMLDivElement;
    // このクラスをインスタンス化したときに即座に form をレンダリングさせたいため以下の処理を行っている
    // 別ファイルの要素をコピーする。true で深いコピー
    const importNode = document.importNode(this.templateElement.content, true);
    this.element = importNode.firstElementChild as HTMLFormElement;
    // 要素に id を付与する例。あえてやっている
    this.element.id = "user-input";
    // それぞれの input の値を取得
    this.inputTitleElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.inputDescriptionElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.inputPeopleElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.inputTitleElement.value;
    const enteredDescription = this.inputDescriptionElement.value;
    const enteredPeople = this.inputPeopleElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      max: 5,
    };

    // 未入力はエラー
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid value. please try again!");
      return;
    } else {
      // this.inputPeopleElement.value は string型になってしまうので +enteredPeople で number 型に変換している
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.inputTitleElement.value = "";
    this.inputDescriptionElement.value = "";
    this.inputPeopleElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    // 配列ならば値を割り振る
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    // bind で this を固定
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
