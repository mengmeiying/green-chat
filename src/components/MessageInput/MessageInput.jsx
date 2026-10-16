import './MessageInput.scss';

function MessageInput() {
  return (
    <form className="message-input">
      <input
        className="message-input__field"
        type="text"
        placeholder="Сообщение"
      />
      <button className="message-input__button" type="submit" aria-label="Отправить">
        ➤
      </button>
    </form>
  );
}

export default MessageInput;