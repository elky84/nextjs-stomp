import { Message } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { connect, disconnect, sendMessage } from "../lib/websocket";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const onMessageReceived = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    connect("http://localhost:9090/ws", onMessageReceived);

    return () => {
      disconnect();
    };
  }, []);

  const handleClick = () => {
    sendMessage("/topic/messages", input);
  };

  return (
    <div>
      <h1 style={{ color: "var(--gray300)" }}>Chat Test</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ height: 32, borderRadius: 8, margin: 8 }}
      />
      <button onClick={handleClick}>Send Message</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index} style={{ padding: 8, color: "var(--gray300)" }}>
            {message.body}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
