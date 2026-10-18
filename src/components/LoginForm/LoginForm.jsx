import { useState } from 'react';
import './LoginForm.scss';

const DEFAULT_API_URL = 'https://4100.api.green-api.com';

function LoginForm({ onLogin, isLoading, error }) {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    onLogin({
      apiUrl: apiUrl.trim().replace(/\/$/, ''),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  }

  const isFilled = apiUrl.trim() && idInstance.trim() && apiTokenInstance.trim();

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Вход в GREEN-API</h1>

        <label className="login__field">
          <span className="login__label">idInstance</span>
          <input
            className="login__input"
            type="text"
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
          />
        </label>

        <label className="login__field">
          <span className="login__label">apiTokenInstance</span>
          <input
            className="login__input"
            type="password"
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
          />
        </label>

        <label className="login__field">
          <span className="login__label">apiUrl</span>
          <input
            className="login__input"
            type="url"
            value={apiUrl}
            onChange={(event) => setApiUrl(event.target.value)}
          />
        </label>

        {error && <p className="login__error">{error}</p>}

        <button
          className="login__button"
          type="submit"
          disabled={!isFilled || isLoading}
        >
          {isLoading ? 'Проверяем…' : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;