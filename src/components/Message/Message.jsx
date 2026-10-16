import './Message.scss';

function Message({ text, direction, time }) {
  return (
    <div className={`message message--${direction}`}>
      <p className="message__text">{text}</p>
      <span className="message__time">{time}</span>
    </div>
  );
}

export default Message;