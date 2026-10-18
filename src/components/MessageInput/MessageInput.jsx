import { useState } from 'react';
import './MessageInput.scss';

function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setText('');
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        className="message-input__field"
        type="text"
        placeholder="Сообщение"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button
        className="message-input__button"
        type="submit"
        aria-label="Отправить"
        disabled={!text.trim()}
      >
        ➤
      </button>
    </form>
  );
}

export default MessageInput;