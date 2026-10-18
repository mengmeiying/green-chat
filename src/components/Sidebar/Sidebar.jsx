import { useState } from 'react';
import './Sidebar.scss';

function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onLogout,
  isCreatingChat,
  chatError,
}) {
  const [phone, setPhone] = useState('');

  const digits = phone.replace(/\D/g, '');
  const isPhoneValid = digits.length >= 10;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isPhoneValid) {
      return;
    }

    const isCreated = await onCreateChat(digits);

    if (isCreated) {
      setPhone('');
    }
  }

  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <h2 className="sidebar__title">Чаты</h2>
        <button className="sidebar__logout" type="button" onClick={onLogout}>
          Выйти
        </button>
      </header>

      <form className="sidebar__new-chat" onSubmit={handleSubmit}>
        <input
          className="sidebar__input"
          type="tel"
          placeholder="Номер телефона"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <button
          className="sidebar__button"
          type="submit"
          disabled={!isPhoneValid || isCreatingChat}
        >
          {isCreatingChat ? 'Ищем…' : 'Новый чат'}
        </button>

        {chatError && <p className="sidebar__error">{chatError}</p>}
      </form>

      {chats.length === 0 ? (
        <p className="sidebar__empty">Чатов пока нет</p>
      ) : (
        <ul className="sidebar__list">
          {chats.map((chat) => (
            <li key={chat.chatId}>
              <button
                type="button"
                className={`sidebar__item ${chat.chatId === activeChatId ? 'sidebar__item--active' : ''}`}
                onClick={() => onSelectChat(chat.chatId)}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Sidebar;