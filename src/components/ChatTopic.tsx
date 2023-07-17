import { Message } from "@stomp/stompjs";
import { ChangeEvent, useState } from "react";
import { connect, disconnect, sendMessage, subscribe, unsubscribe } from "../lib/websocket";

type TopicMessageType = {
  type: string;
  spaceId: string;
  content: string;
  userId: string;
  userName: string;
};

const ChatTopic = () => {

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  
  const [userId, setUserId] = useState("");

  const handleSelectTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(event.target.value);
  };

  const tryConnect = () => {
    connect("http://localhost:9090/ws", userId, () => {
      console.log("onConnected");
    });
  }

  const tryDisconnect = () => {
    disconnect();
  }


  const onMessageReceived = (message: Message) => {
    const topicMessage = JSON.parse(message.body) as TopicMessageType;
    setMessages((prevMessages) => [...prevMessages, `${topicMessage.userName} >> ${topicMessage.content}`]);
  };

  const send = () => {
    if (!selectedTopic) return;

    const { value } = JSON.parse(selectedTopic);
    sendMessage(`/topic/${value}/req`, {message:input});
    setInput("");
  };

  const subscribeTopic = () => {
    if (!topic) return;

    if (subscribe(`/topic/${topic}/res`, userId, onMessageReceived)) {
      setTopics((prevs) => [...prevs, topic]);
      if (!selectedTopic) {
        setSelectedTopic(JSON.stringify({ value: topic, text: topic }));
      }
    }
  };

  const unsubscribeTopic = () => {
    if (!selectedTopic) return;
    const { value } = JSON.parse(selectedTopic);
    if (!value) return;

    if (unsubscribe(`/topic/${value}/res`)) {
      setTopics((prevs) => prevs.filter((x) => x !== value));
    }
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
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Type channel id"
        style={{ margin: 8 }}
      />
      <button onClick={subscribeTopic}>Subscribe</button>

      <select
        style={{ margin: 8 }}
        defaultValue=""
        value={selectedTopic}
        onChange={handleSelectTopicChange}
      >
        <option
          key={`option-none`}
          value={JSON.stringify({ value: "", text: "" })}
        >
          {""}
        </option>
        {topics.map((value, index) => (
          <option
            key={`option-${index}`}
            value={JSON.stringify({ value: value, text: value })}
          >
            {value}
          </option>
        ))}
      </select>

      <button onClick={unsubscribeTopic}>Unsubscribe</button>

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
    </div>
  );
};

export default ChatTopic;
