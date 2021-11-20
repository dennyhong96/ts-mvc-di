import { inject } from "inversify-props";
import { ControllerBase } from "./BaseController";
import { MyApp } from "..";
import { ChatroomsModel } from "@/models/ChatroomsModel";
import { ChatroomsView } from "@/views/ChatroomsView";
import { ISSEService } from "@/types/interfaces/services/ISSEService";

export class ChatroomsController extends ControllerBase {
  @inject() private chatroomsView!: ChatroomsView;
  @inject() private chatroomsModel!: ChatroomsModel;
  @inject() private SSEService!: ISSEService;

  constructor(public app: MyApp) {
    super(app);

    this.chatroomsView.registerContainer(this.pageContainer);
  }

  // @ts-ignore
  protected async loadPage(params: QueryParams): Promise<void> {
    if (!this.authModel.state.userId) {
      this.app.getRouter().navigate("/");
      return;
    }
    this.renderPage();
    this.pubsub.subscribe(ChatroomsModel.name, this.renderPage);
    this.SSEService.registerEventsource(`${process.env.API_URL}/chatrooms/sse`, async () => {
      await this.chatroomsModel.loadChatrooms();
      this.pubsub.publish(ChatroomsModel.name);
    });
    // await this.loadChatrooms();
  }

  public unload(): void {
    this.pubsub.clean(ChatroomsModel.name, this.renderPage);
    this.SSEService.closeEventSource(`${process.env.API_URL}/chatrooms/sse`);
    super.unload();
  }

  protected renderPage = (() => {
    this.render(
      this.pageContainer,
      this.chatroomsView.render({
        chatrooms: this.chatroomsModel.state.chatrooms,
        joinChatroom: this.joinChatroom.bind(this),
      }),
    );
  }).bind(this);

  public async loadChatrooms(): Promise<void> {
    await this.chatroomsModel.loadChatrooms();
    this.pubsub.publish(ChatroomsModel.name);
  }

  public async joinChatroom(chatroomId: string): Promise<void> {
    await this.chatroomsModel.enterChatroom(chatroomId);
    this.app.navigate(`/chats/${chatroomId}`);
  }
}