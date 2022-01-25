import { DragTarget } from "../models/drag-drop";
import { Project, ProjectStatus } from "../models/project";
import { Component } from "./base-component";
import { autobind } from "../decarators/autobind";
import { projectState } from "../state/project-state";
import { ProjectItem } from "./project-item";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];
  // project が active か fiished か属性を分けて生成
  constructor(readonly type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.configure();
    this.renderContent();
  }

  // drag 中の event
  @autobind
  dragOverHandler(event: DragEvent): void {
    // 値が付与されていればイベント開始
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      // javascriptは drop イベントを許可していないため必要
      // 公式 https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  // drag 適用されている field から離れると発生
  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    projectState.addListener((projects: Project[]) => {
      // status が active でなければ false で削除
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  // DOM生成
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    // 一度クリアして再レンダリング
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      // ul配下にレンダリングしたいため以下のように指定
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}
