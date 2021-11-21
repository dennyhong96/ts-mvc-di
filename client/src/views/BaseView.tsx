import { View } from "@/views/View";
import { injectable } from "inversify-props";

import logoutIcon from "@/assets/icons/logout.svg";
import styles from "@/styles/BaseView.module.scss";
import { Utils } from "@/utils/Utils";

@injectable()
export class BaseView extends View {
  public pageContainer: HTMLDivElement = (<div className={this.cx(styles.pageContainer)}></div>);

  public render(props: { username: string; logout: () => void }): HTMLElement {
    const { username, logout } = props;

    return (
      <div className={this.cx(styles.page)}>
        {username && (
          <header className={this.cx(styles.header)}>
            <div className={this.cx(styles.user)}>{Utils.generateAvatarText(username)}</div>
            <button className={this.cx(styles.logout)} onclick={logout}>
              <img src={logoutIcon} alt="Logout" />
            </button>
          </header>
        )}
        {this.pageContainer}
      </div>
    );
  }
}
