import Message from '../Message/Message';
import MessageInput from '../MessageInput/MessageInput';
import './ChatWindow.scss';

function ChatWindow({ chat, messages, onSendMessage }) {
  if (!chat) {
    return (
      <section className="chat-window chat-window--empty">
        <p className="chat-window__placeholder">Выберите чат или создайте новый</p>
      </section>
    );
  }

  return (
    <section className="chat-window">
      <header className="chat-window__header">+{chat.phone}</header>

      <div className="chat-window__messages">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            text={msg.text}
            direction={msg.direction}
            timestamp={msg.timestamp}
          />
        ))}
      </div>

      <MessageInput onSend={onSendMessage} />
    </section>
  );
}

export default ChatWindow;