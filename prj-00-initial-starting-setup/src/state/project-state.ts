import { Project, ProjectStatus } from "../models/project";

// Project State Management
// ただの関数のため type を使用
type Listner<T> = (item: T[]) => void;

// inheritance
class State<T> {
  // protected 継承先からならアクセス可能
  protected listeners: Listner<T>[] = [];

  addListener(listenerFn: Listner<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListner();
  }

  // project の status 書き換え処理
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListner();
    }
  }

  private updateListner() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  // class に直接紐づくようになる
  // getInstance したときに instance があれば返却するので singleton が保証されている
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
}

export const projectState = ProjectState.getInstance();
