import { useEffect, useRef } from 'react';
import Message from '../Message/Message';
import MessageInput from '../MessageInput/MessageInput';
import './ChatWindow.scss';

function ChatWindow({ chat, messages, onSendMessage }) {
  const messagesRef = useRef(null);

  useEffect(() => {
    const list = messagesRef.current;

    if (list) {
      list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  if (!chat) {
    return (
      <section className="chat-window chat-window--empty">
        <p className="chat-window__placeholder">Выберите чат или создайте новый</p>
      </section>
    );
  }

  return (
    <section className="chat-window">
      <header className="chat-window__header">{chat.title}</header>

      <div className="chat-window__messages" ref={messagesRef}>
        {messages.map((msg) => (
          <Message
            key={msg.id}
            text={msg.text}
            direction={msg.direction}
            timestamp={msg.timestamp}
            status={msg.status}
          />
        ))}
      </div>

      <MessageInput onSend={onSendMessage} />
    </section>
  );
}

export default ChatWindow;