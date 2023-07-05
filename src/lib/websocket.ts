import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client;

export const connect = (
  url: string,
  onMessageReceived: (message: IMessage) => void
) => {
  const socket = new SockJS(url);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
      console.log(str);
    },
  });

  stompClient.onConnect = () => {
    console.log("Connected to the STOMP server");
    stompClient.subscribe("/topic/messages", onMessageReceived);
  };

  stompClient.onStompError = (frame) => {
    console.log("STOMP error:", frame);
  };

  stompClient.activate();
};

export const disconnect = () => {
  stompClient?.deactivate();
};

export const sendMessage = (destination: string, body: string) => {
  stompClient?.publish({
    destination,
    body,
  });
};
