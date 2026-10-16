import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import './App.scss';

const chats = [
  { chatId: '10000001', phone: '79991234567' },
  { chatId: '10000002', phone: '79997654321' },
];

const messages = [
  { id: 1, chatId: '10000001', text: 'Привет!', direction: 'out', time: '15:40' },
  { id: 2, chatId: '10000001', text: 'Привет, как дела?', direction: 'in', time: '15:41' },
  { id: 3, chatId: '10000001', text: 'Делаю тестовое 🙂', direction: 'out', time: '15:42' },
];

function App() {
  const activeChatId = '10000001';
  const activeChat = chats.find((chat) => chat.chatId === activeChatId);
  const activeMessages = messages.filter((msg) => msg.chatId === activeChatId);

  return (
    <div className="app">
      <Sidebar chats={chats} activeChatId={activeChatId} />
      <ChatWindow chat={activeChat} messages={activeMessages} />
    </div>
  );
}

export default App;