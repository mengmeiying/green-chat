function buildUrl(credentials, method, extra = '') {
  const { apiUrl, idInstance, apiTokenInstance } = credentials;
  return `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}${extra}`;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getStateInstance(credentials) {
  return request(buildUrl(credentials, 'getStateInstance'));
}

export function checkAccount(credentials, phoneNumber) {
  return request(buildUrl(credentials, 'checkAccount'), {
    method: 'POST',
    body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
  });
}

export function sendMessage(credentials, chatId, message) {
  return request(buildUrl(credentials, 'sendMessage'), {
    method: 'POST',
    body: JSON.stringify({ chatId, message }),
  });
}

export function receiveNotification(credentials, timeoutSeconds = 20, signal) {
  return request(
    buildUrl(credentials, 'receiveNotification', `?receiveTimeout=${timeoutSeconds}`),
    { signal },
  );
}

export function deleteNotification(credentials, receiptId) {
  return request(buildUrl(credentials, 'deleteNotification', `/${receiptId}`), {
    method: 'DELETE',
  });
}