import './Message.scss';

const STATUS_ICONS = {
  sending: '🕓',
  sent: '✓',
  error: '⚠',
};

const STATUS_LABELS = {
  sending: 'Отправляется',
  sent: 'Отправлено',
  error: 'Не отправлено',
};

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Message({ text, direction, timestamp, status }) {
  const className = [
    'message',
    `message--${direction}`,
    status === 'error' ? 'message--error' : '',
  ].join(' ');

  return (
    <div className={className}>
      <p className="message__text">{text}</p>
      <span className="message__meta">
        {formatTime(timestamp)}
        {status && (
          <span className="message__status" aria-label={STATUS_LABELS[status]}>
            {STATUS_ICONS[status]}
          </span>
        )}
      </span>
    </div>
  );
}

export default Message;