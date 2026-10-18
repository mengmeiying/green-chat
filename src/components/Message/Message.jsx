import './Message.scss';

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Message({ text, direction, timestamp }) {
  return (
    <div className={`message message--${direction}`}>
      <p className="message__text">{text}</p>
      <span className="message__time">{formatTime(timestamp)}</span>
    </div>
  );
}

export default Message;