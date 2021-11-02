import { View } from "@/views/View";
import { ITodoState } from "@/types/interfaces/ITodoState";

import styles from "@/styles/TodoView.module.scss";
import { IView } from "@/types/interfaces/views/IView";

export class TodoView extends View<ITodoState> implements IView<ITodoState> {
  constructor(public container: HTMLElement) {
    super(container);
  }

  public generateMarkup(data: ITodoState): string {
    return `
    <ul>
    ${data.todos
      .map(
        (td) =>
          `<li data-todo-id="${td.id}" class="${this.cn(
            styles.item,
            td.completed ? styles.completed : "",
          )}">
            ${td.title}
            <button>x</button>
          </li>`,
      )
      .join("")}
    </ul>
    `;
  }
}
