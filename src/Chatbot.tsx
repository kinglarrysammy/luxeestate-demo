import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { properties, formatPrice } from './data';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

const QUICK_REPLIES = [
  'Show me waterfront homes',
  'What is the price range?',
  'Schedule a viewing',
  'Homes under $1M',
  'Tell me about Aspen properties',
];

function getBotReply(input: string): string {
  const q = input.toLowerCase();

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! I'm the LuxeEstate assistant. I can help you find properties, check prices, or schedule a viewing. What are you looking for?";
  }

  if (q.includes('waterfront') || q.includes('ocean') || q.includes('beach') || q.includes('lake')) {
    const matches = properties.filter(p =>
      p.title.toLowerCase().includes('water') ||
      p.title.toLowerCase().includes('beach') ||
      p.title.toLowerCase().includes('lake') ||
      p.location.toLowerCase().includes('malibu') ||
      p.location.toLowerCase().includes('miami') ||
      p.location.toLowerCase().includes('tahoe')
    );
    if (matches.length) {
      return `We have ${matches.length} waterfront / coastal properties:\n\n` +
        matches.map(p => `• ${p.title} – ${formatPrice(p.price)} (${p.location})`).join('\n') +
        `\n\nWould you like more details on any of these?`;
    }
  }

  if (q.includes('aspen') || q.includes('mountain') || q.includes('ski')) {
    const p = properties.find(x => x.location.includes('Aspen'));
    if (p) {
      return `We have a stunning Mountain Retreat Estate in Aspen:\n\n${p.title}\n${formatPrice(p.price)} • ${p.beds} beds • ${p.baths} baths • ${p.sqft.toLocaleString()} sqft\n\n${p.description}\n\nWould you like to schedule a private viewing?`;
    }
  }

  if (q.includes('under') && (q.includes('1m') || q.includes('1 m') || q.includes('million') || q.includes('1000000'))) {
    const matches = properties.filter(p => p.price < 1000000);
    return `Properties under $1M:\n\n` +
      matches.map(p => `• ${p.title} – ${formatPrice(p.price)} (${p.location})`).join('\n') +
      `\n\nI can send you full details or arrange a tour.`;
  }

  if (q.includes('price') || q.includes('range') || q.includes('cost') || q.includes('budget')) {
    const prices = properties.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `Our current listings range from ${formatPrice(min)} to ${formatPrice(max)}. Most of our featured homes sit between $900k and $2.5M. What's your budget range?`;
  }

  if (q.includes('viewing') || q.includes('tour') || q.includes('visit') || q.includes('schedule') || q.includes('appointment')) {
    return "I'd be happy to arrange a private viewing. Please share:\n\n1. Which property interests you (or the location)\n2. Your preferred dates\n3. Your name and best contact number/email\n\nA specialist will confirm within a few hours.";
  }

  if (q.includes('malibu') || q.includes('villa')) {
    const p = properties.find(x => x.id === 1);
    if (p) {
      return `${p.title} in ${p.location}\n${formatPrice(p.price)} • ${p.beds} beds • ${p.baths} baths\n\n${p.description}\n\nThis is one of our most requested properties. Shall I reserve a viewing slot?`;
    }
  }

  if (q.includes('manhattan') || q.includes('penthouse') || q.includes('new york') || q.includes('nyc')) {
    const p = properties.find(x => x.id === 2);
    if (p) {
      return `${p.title}\n${formatPrice(p.price)} • ${p.beds} beds • ${p.baths} baths\n\n${p.description}`;
    }
  }

  if (q.includes('contact') || q.includes('agent') || q.includes('speak') || q.includes('call')) {
    return "You can reach our team at:\n\n📧 concierge@luxeestate.demo\n📞 (555) 014-2800\n\nOr just continue chatting here and I'll connect you with the right specialist.";
  }

  if (q.includes('thank')) {
    return "You're very welcome! I'm here whenever you need anything else. Looking forward to helping you find the perfect home.";
  }

  return "Thanks for your message. I can help with:\n• Property recommendations\n• Pricing & availability\n• Scheduling viewings\n• Specific locations (Malibu, Aspen, Miami, Manhattan…)\n\nJust tell me what you're looking for!";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: "Hi! I'm your LuxeEstate assistant 🏠\n\nI can help you explore properties, check prices, or schedule a private viewing. What are you looking for today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
      setTyping(false);
    }, 700 + Math.random() * 600);
  };

  return (
    <>
      <button
        className={`chat-fab ${open ? 'hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <MessageCircle size={26} />
        <span className="chat-fab-pulse" />
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Bot size={20} />
              </div>
              <div>
                <strong>LuxeEstate Assistant</strong>
                <span className="chat-status">Online • Usually replies instantly</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(m => (
              <div key={m.id} className={`chat-bubble ${m.role}`}>
                <div className="chat-icon">
                  {m.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="chat-text">{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="chat-bubble bot">
                <div className="chat-icon"><Bot size={16} /></div>
                <div className="chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length < 4 && (
            <div className="chat-quick">
              {QUICK_REPLIES.map(q => (
                <button key={q} onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <form
            className="chat-input-area"
            onSubmit={e => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about properties, prices, viewings..."
              autoFocus
            />
            <button type="submit" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
