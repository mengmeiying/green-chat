import './Sidebar.scss';

function Sidebar({ chats, activeChatId }) {
  return (
    <aside className="sidebar">
      <form className="sidebar__new-chat">
        <input
          className="sidebar__input"
          type="tel"
          placeholder="Номер телефона"
        />
        <button className="sidebar__button" type="submit">
          Новый чат
        </button>
      </form>

      <ul className="sidebar__list">
        {chats.map((chat) => (
          <li
            key={chat.chatId}
            className={`sidebar__item ${chat.chatId === activeChatId ? 'sidebar__item--active' : ''}`}
          >
            +{chat.phone}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;