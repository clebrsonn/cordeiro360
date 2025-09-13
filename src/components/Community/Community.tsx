import React, { useState } from 'react';
import '../Overview/Overview.css'; // Reusing card styles
import './Community.css';

interface Message {
  user: string;
  text: string;
}

const initialMessages: Message[] = [
  { user: 'Joao', text: 'Fiz a vermifugacao do rebanho, conforme o protocolo.' },
  { user: 'Maria', text: 'Minhas coxinhas de cordeiro ficaram an delicia!' },
  { user: 'Pedro', text: 'Teste uma receita de carne ovina que adaptei.' },
];

const Community: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { user: 'Você', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="card community">
      <h2 className="community-title">Comunidade</h2>
      <div className="community-feed">
        {messages.map((msg, index) => (
          <div className="feed-item" key={index}>
            <div className="avatar"></div>
            <div className="feed-content">
              <p className="feed-user"><strong>{msg.user}</strong></p>
              <p className="feed-text">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="community-input">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>➤</button>
      </div>
    </div>
  );
};

export default Community;
