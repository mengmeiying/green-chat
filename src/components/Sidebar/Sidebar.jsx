import { useState } from 'react';
import './Sidebar.scss';

function Sidebar({ chats, activeChatId, onSelectChat, onCreateChat, onLogout }) {
  const [phone, setPhone] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const digits = phone.replace(/\D/g, '');

    if (digits.length < 10) {
      return;
    }

    onCreateChat(digits);
    setPhone('');
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
        <button className="sidebar__button" type="submit">
          Новый чат
        </button>
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
                +{chat.phone}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Sidebar;