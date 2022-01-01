class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  inputTitleElement: HTMLInputElement;
  inputDescriptionElement: HTMLInputElement;
  inputPeapleElement: HTMLInputElement;

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
    )! as HTMLInputElement;
    this.inputDescriptionElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.inputPeapleElement = this.element.querySelector(
      "#peaple"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.inputTitleElement.value);
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
