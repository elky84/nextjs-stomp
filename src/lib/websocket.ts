import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client;

export const connect = (
  url: string
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
  };

  stompClient.onStompError = (frame) => {
    console.log("STOMP error:", frame);
  };

  stompClient.activate();
};

export const subscribe = (destination: string, onMessageReceived: (message: IMessage) => void) => {
  if(!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  stompClient.subscribe(`/topic/${destination}/res`, onMessageReceived);
  return true;
}

export const unsubscribe = (destination: string) => {
  if(!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  stompClient.unsubscribe(`/topic/${destination}/res`);
  return true;
}


export const disconnect = () => {
  if(!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  stompClient.deactivate();
  return true;
};

export const sendMessage = (destination: string, body: string) => {
  if(!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  stompClient.publish({
    destination: `/topic/${destination}/res`,
    body,
  });

  return true;
};
