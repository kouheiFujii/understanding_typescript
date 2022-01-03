import { Component } from "./base-component.js";
import { Validatable, validate } from "../util/validation.js";
import { autobind } from "../decarators/autobind.js";
import { projectState } from "../state/project-state.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  inputTitleElement: HTMLInputElement;
  inputDescriptionElement: HTMLInputElement;
  inputPeopleElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

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
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

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
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}
