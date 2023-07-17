import { Message } from "@stomp/stompjs";
import { ChangeEvent, useState } from "react";
import {
  connect,
  disconnect,
  sendMessage,
  subscribe,
} from "../lib/websocket";

type UserType = {
  senderId: string;
  receiverId: string;
  channelCollection: string;
  id: string;
  created: string;
  updated: string;
};

type PageType = {
  page: number;
  size: number;
  total: number;
  totalPage: number;
};

type MessageType = {
  sender: string;
  senderName: string;
  receiver: string;
  content: string;
  id: string;
  created: string;
  updated: string;
};

const Chat = () => {

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const [userId, setUserId] = useState("");

  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [page, setPage] = useState(0);

  const [loadEnd, setLoadEnd] = useState(false);

  const tryConnect = () => {

    connect("http://localhost:9090/ws", userId, () => {
      subscribe(`/private/${userId}`, userId, onMessageReceived);
      sendMessage(`/private/users`, {});
    });
  }

  const tryDisconnect = () => {
    disconnect();
  }

  const canLoadMore =
    selectedUser && JSON.parse(selectedUser)?.value && !loadEnd;

  const loadMore = () => {
    if (canLoadMore) {
      sendMessage(`/private/${JSON.parse(selectedUser).value}/messages`, {
        page: page + 1,
        size: 20,
      });
    }
  };

  const handleSelectUserChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
    const parse = JSON.parse(event.target.value);
    if (parse.value) {
      sendMessage(`/private/${parse.value}/messages`, { page: 0, size: 20 });
    }

    setLoadEnd(false);
  };

  const onMessageReceived = (message: Message) => {
    const json = JSON.parse(message.body);
    const id = json.id;
    console.log("메시지 id", id);

    if (id == "CHAT_MESSAGE") {
      setMessages((prevMessages) => [
        `${json.userName} >> ${json.content}`,
        ...prevMessages,
      ]);
    } else if (id == "CHAT_MESSAGES") {
      const page = json.page as PageType;
      if (page.page == 0) {
        setMessages([]);
        onLog(`--- ${json.receiverId} 와의 이전 채팅 목록을 불러옵니다 ---`);
      }

      const messageList = json.messages as MessageType[];
      if (page.page + 1 >= page.totalPage) {
        setLoadEnd(true);
      }

      setPage(page.page);
      setMessages((prevMessages) => [
        ...prevMessages,
        ...messageList.map((el) => `${el.senderName} >> ${el.content}`),
      ]);
    } else if (id == "USERS") {
      console.log(json);
      setUsers([]);

      const users = json.users.content as UserType[];
      setUsers(users.map((el) => el.receiverId));
    } else if (id == "ADD_USER") {
      console.log(json.user);
      setUsers((prevUsers) => [...prevUsers, json.user.receiverId]);
    } else if (id == "REMOVE_USER") {
      console.log(json);
      setUsers(users.filter((el) => el == json.userId));
    }
  };

  const onLog = (message: string) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
  };

  const send = () => {
    if (!input) return;

    if (!selectedUser) return;
    const { value } = JSON.parse(selectedUser);
    if (!value) {
      console.log("채팅 대상을 선택해야 합니다");
      return;
    }

    sendMessage(`/private/${value}`, { message: input });
    setInput("");
    onLog(`${userId} >> ${input}`);
  };

  const addUser = () => {
    if (!receiverId) return;

    sendMessage(`/private/${receiverId}/addUser`);
  };

  const removeUser = () => {
    if (!receiverId) return;

    sendMessage(`/private/${receiverId}/removeUser`);
  };

  return (
    <div>
      <h1 style={{ color: "var(--gray300)" }}>Chat Test</h1>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Type user id"
        style={{ margin: 8 }}
      />
      <button onClick={tryConnect}>connect</button>
      <button onClick={tryDisconnect}>disconnect</button>

      <input
        type="text"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        placeholder="Type receiver id"
        style={{ margin: 8 }}
      />
      <button onClick={addUser}>addUser</button>

      <select
        style={{ margin: 8 }}
        defaultValue=""
        value={selectedUser}
        onChange={handleSelectUserChange}
      >
        <option
          key={`option-none`}
          value={JSON.stringify({ value: "", text: "" })}
        >
          {""}
        </option>
        {users.map((value, index) => (
          <option
            key={`option-${index}`}
            value={JSON.stringify({ value: value, text: value })}
          >
            {value}
          </option>
        ))}
      </select>

      <button onClick={removeUser}>RemoveUser</button>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ margin: 8 }}
        />
        <button onClick={send}>Send Message</button>
      </div>

      <ul>
        {messages.map((message, index) => (
          <li key={index} style={{ padding: 8, color: "var(--gray300)" }}>
            {message}
          </li>
        ))}
      </ul>

      {canLoadMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
};

export default Chat;
