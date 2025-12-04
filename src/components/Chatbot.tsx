import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaCommentDots, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

const ChatButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--verde-medio);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1000;
  transition: transform 0.3s, background 0.3s;

  &:hover {
    transform: scale(1.1);
    background: var(--verde-escuro);
  }
`;

const ChatWindow = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  transform: ${props => props.$isOpen ? 'scale(1)' : 'scale(0)'};
  transform-origin: bottom right;
  transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    width: calc(100% - 40px);
    right: 20px;
    bottom: 90px;
  }
`;

const ChatHeader = styled.div`
  background: var(--verde-medio);
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #f9f9f9;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  line-height: 1.4;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.$isUser ? 'var(--verde-medio)' : 'white'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  border-bottom-right-radius: ${props => props.$isUser ? '5px' : '15px'};
  border-bottom-left-radius: ${props => props.$isUser ? '15px' : '5px'};
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);

  /* Markdown Styles */
  p { margin: 0; }
  a { color: inherit; text-decoration: underline; }
  ul, ol { margin: 5px 0; padding-left: 20px; }
`;

const InputArea = styled.form`
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: var(--verde-medio);
  }
`;

const SendButton = styled.button`
  background: var(--verde-medio);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: var(--verde-escuro);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: 'Olá! Sou o assistente virtual do Green Trail. Como posso ajudar você hoje?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user && !socketRef.current) {
      // Connect to WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // Use current host (which includes port) - Vite proxy will handle the forwarding in dev
      // "Gambiarra" applied
      const host = `${import.meta.env.VITE_API_BASE_URL.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '')}`;

      // Get token from localStorage directly since useAuth might not expose it directly depending on implementation
      // Assuming api.ts stores it in localStorage 'access_token'
      const token = localStorage.getItem('access_token');

      if (!token) return;

      const wsUrl = `${protocol}//${host}/ws/chat/${user.id}/?token=${token}`;

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Only add message if it's from the bot (user messages are added optimistically)
        // OR if the backend echoes user messages, handle that.
        // The backend echoes: 'user': user.username for user messages
        // and 'user': 'chatbot' for bot messages.

        if (data.user === 'chatbot') {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: data.message,
            sender: 'bot'
          }]);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        socketRef.current = null;
      };

      socketRef.current = socket;
    }

    return () => {
      if (!isOpen && socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socketRef.current || !isConnected) return;

    const messageText = inputValue.trim();

    // Optimistic update
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user'
    }]);

    socketRef.current.send(JSON.stringify({
      message: messageText
    }));

    setInputValue('');
  };

  if (!user) return null;

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaCommentDots />}
      </ChatButton>

      <ChatWindow $isOpen={isOpen}>
        <ChatHeader>
          <div>
            <FaRobot />
            <span>Assistente do Green Trail</span>
          </div>
          <CloseButton onClick={() => setIsOpen(false)}>
            <FaTimes />
          </CloseButton>
        </ChatHeader>

        <MessagesContainer>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} $isUser={msg.sender === 'user'}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputArea onSubmit={handleSubmit}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={!isConnected}
          />
          <SendButton type="submit" disabled={!inputValue.trim() || !isConnected}>
            <FaPaperPlane />
          </SendButton>
        </InputArea>
      </ChatWindow>
    </>
  );
}
