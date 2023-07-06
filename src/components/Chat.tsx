import { Message } from "@stomp/stompjs";
import { ChangeEvent, useEffect, useState } from "react";
import { connect, disconnect, sendMessage, subscribe, unsubscribe } from "../lib/websocket";
import { useForm } from "react-hook-form";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleSelectTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(event.target.value);
  };

  const {
    handleSubmit,
  } = useForm();

  useEffect(() => {
    connect("http://localhost:9090/ws");

    return () => {
      disconnect();
    };
  }, []);

  const onMessageReceived = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message.body]);
  };

  const onLog = (message : string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  const send = () => {
    if(!selectedTopic || !input)
      return;

    const {value} = JSON.parse(selectedTopic);
    sendMessage(value, input);
    setInput("");
  };

  const subscribeTopic = () => {
    if(!topic)
      return;

    if(subscribe(topic, onMessageReceived)) {
      setTopics((prevs) => [...prevs, topic]);
      if(!selectedTopic) {
        setSelectedTopic(JSON.stringify({value: topic, text: topic}));
      }
    }
  }

  const unsubscribeTopic = () => {
    if(!topic)
      return;

    if(unsubscribe(topic)) {
      setTopics((prevs) => prevs.filter(value => value !== topic));
    }
  }

  return (
    <form onSubmit={handleSubmit(send)}>
      <h1 style={{ color: "var(--gray300)" }}>Chat Test</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Type channel id"
        style={{ height: 32, borderRadius: 8, margin: 8 }}
      />
      <button onClick={subscribeTopic}>Subscribe</button>

      <select
        style={{height: 32, borderRadius: 8, margin: 8}}
        defaultValue=""
        value={selectedTopic}
        onChange={handleSelectTopicChange}
      >
        <option
          key={`option-none`}
          value={JSON.stringify({ value: '', text: '' })}
        >
          {''}
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

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ height: 32, borderRadius: 8, margin: 8 }}
      />
      <button onClick={send}>Send Message</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index} style={{ padding: 8, color: "var(--gray300)" }}>
            {message}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default Chat;
