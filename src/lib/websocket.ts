import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client;

export const connect = (url: string, userId: string, onConnect: () => void) => {
  const socket = new SockJS(url);
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      UserId: userId,
    },
    debug: (str) => {
      console.log(str);
    },
  });

  stompClient.onConnect = () => {
    console.log("Connected to the STOMP server");
    onConnect();
  };

  stompClient.onStompError = (frame) => {
    console.log("STOMP error:", frame);
  };

  stompClient.activate();
};

export const subscribe = (
  destination: string,
  userId: string,
  onMessageReceived: (message: IMessage) => void
) => {
  if (!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  console.log(destination);

  stompClient.subscribe(destination, onMessageReceived, { UserId: userId });
  return true;
};

export const unsubscribe = (destination: string) => {
  if (!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  stompClient.unsubscribe(destination);
  return true;
};

export const disconnect = () => {
  if (!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  stompClient.deactivate();
  return true;
};

export const sendMessage = (destination: string, body: any = {}) => {
  if (!stompClient || !stompClient.connected) {
    console.log("STOMP not connected");
    return false;
  }

  console.log(destination);
  console.log(body);

  stompClient.publish({
    destination: destination,
    body: JSON.stringify(body),
  });

  return true;
};
