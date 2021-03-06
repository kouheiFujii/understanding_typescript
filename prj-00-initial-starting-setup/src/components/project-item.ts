import { Dragable } from "../models/drag-drop";
import { Project } from "../models/project";
import { Component } from "./base-component";
import { autobind } from "../decarators/autobind";

// ProjectItem Class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Dragable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  // drag 処理 start event
  @autobind
  dragStartHandler(event: DragEvent): void {
    // データの識別のために値を付与
    event.dataTransfer!.setData("text/plain", this.project.id);
    // ドラッグ操作の許可する effect を指定
    event.dataTransfer!.effectAllowed = "move";
  }

  // drag 処理 end event
  dragEndHandler(_: DragEvent): void {
    console.log("dragEnd");
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
