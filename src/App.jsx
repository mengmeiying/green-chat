import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import './App.scss';

function App() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const activeChat = chats.find((chat) => chat.chatId === activeChatId);
  const activeMessages = messages.filter((msg) => msg.chatId === activeChatId);

  function handleSelectChat(chatId) {
    setActiveChatId(chatId);
  }

  function handleCreateChat(phone) {
    const existingChat = chats.find((chat) => chat.phone === phone);

    if (existingChat) {
      setActiveChatId(existingChat.chatId);
      return;
    }

    // Временно: chatId = номер. Потом настоящий chatId придёт из CheckAccount
    const newChat = { chatId: phone, phone };

    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.chatId);
  }

  function handleSendMessage(text) {
    const newMessage = {
      id: crypto.randomUUID(),
      chatId: activeChatId,
      text,
      direction: 'out',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
      />
      <ChatWindow
        chat={activeChat}
        messages={activeMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;