import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import LoginForm from './components/LoginForm/LoginForm';
import {
  getStateInstance,
  checkAccount,
  sendMessage,
  receiveNotification,
  deleteNotification,
} from './api/greenApi';
import './App.scss';

const STORAGE_KEY = 'green-chat-credentials';
const RETRY_DELAY_MS = 5000;

function loadCredentials() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseIncomingMessage(body) {
  if (body?.typeWebhook !== 'incomingMessageReceived') {
    return null;
  }

  const { messageData, senderData } = body;
  let text = null;

  if (messageData?.typeMessage === 'textMessage') {
    text = messageData.textMessageData?.textMessage;
  } else if (messageData?.typeMessage === 'extendedTextMessage') {
    text = messageData.extendedTextMessageData?.text;
  }

  if (!text) {
    return null;
  }

  const chatId = String(senderData.chatId);
  const phone = senderData.senderPhoneNumber ? String(senderData.senderPhoneNumber) : '';

  return {
    chat: {
      chatId,
      phone,
      title: phone ? `+${phone}` : senderData.chatName || chatId,
    },
    message: {
      id: body.idMessage,
      chatId,
      text,
      direction: 'in',
      timestamp: body.timestamp * 1000,
    },
  };
}

function App() {
  const [credentials, setCredentials] = useState(loadCredentials);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [chatError, setChatError] = useState('');

  useEffect(() => {
    if (!credentials) {
      return undefined;
    }

    const controller = new AbortController();

    async function poll() {
      while (!controller.signal.aborted) {
        try {
          const notification = await receiveNotification(credentials, 20, controller.signal);

          if (!notification) {
            continue;
          }

          const incoming = parseIncomingMessage(notification.body);

          if (incoming) {
            setChats((prev) =>
              prev.some((chat) => chat.chatId === incoming.chat.chatId)
                ? prev
                : [...prev, incoming.chat],
            );

            setMessages((prev) =>
              prev.some((msg) => msg.id === incoming.message.id)
                ? prev
                : [...prev, incoming.message],
            );
          }

          await deleteNotification(credentials, notification.receiptId);
        } catch {
          if (controller.signal.aborted) {
            return;
          }

          await delay(RETRY_DELAY_MS);
        }
      }
    }

    poll();

    return () => controller.abort();
  }, [credentials]);

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
    setChatError('');
  }

  function handleSelectChat(chatId) {
    setActiveChatId(chatId);
  }

  async function handleCreateChat(phone) {
    setChatError('');

    const existingChat = chats.find((chat) => chat.phone === phone);

    if (existingChat) {
      setActiveChatId(existingChat.chatId);
      return true;
    }

    setIsCreatingChat(true);

    try {
      const result = await checkAccount(credentials, phone);

      if (!result?.exist) {
        setChatError('У этого номера нет Telegram, или он скрыт настройками приватности.');
        return false;
      }

      const chatId = String(result.chatId);
      const newChat = { chatId, phone, title: `+${phone}` };

      setChats((prev) => {
        const alreadyExists = prev.some((chat) => chat.chatId === chatId);
        return alreadyExists ? prev : [...prev, newChat];
      });
      setActiveChatId(chatId);

      return true;
    } catch {
      setChatError('Не удалось проверить номер. Попробуйте ещё раз.');
      return false;
    } finally {
      setIsCreatingChat(false);
    }
  }

  function updateMessageStatus(messageId, status) {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)),
    );
  }

  async function handleSendMessage(text) {
    const chatId = activeChatId;

    const newMessage = {
      id: crypto.randomUUID(),
      chatId,
      text,
      direction: 'out',
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      await sendMessage(credentials, chatId, text);
      updateMessageStatus(newMessage.id, 'sent');
    } catch {
      updateMessageStatus(newMessage.id, 'error');
    }
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
        isCreatingChat={isCreatingChat}
        chatError={chatError}
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