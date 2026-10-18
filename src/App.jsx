import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import LoginForm from './components/LoginForm/LoginForm';
import { getStateInstance } from './api/greenApi';
import './App.scss';

const STORAGE_KEY = 'green-chat-credentials';

function loadCredentials() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function App() {
  const [credentials, setCredentials] = useState(loadCredentials);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const activeChat = chats.find((chat) => chat.chatId === activeChatId);
  const activeMessages = messages.filter((msg) => msg.chatId === activeChatId);

  async function handleLogin(newCredentials) {
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const state = await getStateInstance(newCredentials);

      if (state?.stateInstance !== 'authorized') {
        setLoginError('Инстанс не авторизован. Отсканируйте QR-код в личном кабинете GREEN-API.');
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));
      setCredentials(newCredentials);
    } catch {
      setLoginError('Не удалось подключиться. Проверьте idInstance, apiTokenInstance и apiUrl.');
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setCredentials(null);
    setChats([]);
    setMessages([]);
    setActiveChatId(null);
  }

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

  if (!credentials) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        error={loginError}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onLogout={handleLogout}
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