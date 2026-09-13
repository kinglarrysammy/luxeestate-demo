import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { properties, formatPrice } from './data';
import { translations, Lang } from './i18n';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

interface ChatbotProps {
  lang: Lang;
}

function getBotReply(input: string, lang: Lang): string {
  const q = input.toLowerCase();
  const t = translations[lang];

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('bonjour') || q.includes('مرحبا') || q.includes('salam')) {
    return t.chatWelcome;
  }

  if (q.includes('waterfront') || q.includes('ocean') || q.includes('beach') || q.includes('lake') ||
      q.includes('mer') || q.includes('plage') || q.includes('واجهة') || q.includes('بحر')) {
    const matches = properties.filter(p =>
      p.title.toLowerCase().includes('water') ||
      p.title.toLowerCase().includes('beach') ||
      p.title.toLowerCase().includes('lake') ||
      p.location.toLowerCase().includes('malibu') ||
      p.location.toLowerCase().includes('miami') ||
      p.location.toLowerCase().includes('tahoe')
    );
    if (matches.length) {
      const header = lang === 'fr'
        ? `Nous avons ${matches.length} propriétés en bord de mer :\n\n`
        : lang === 'ar'
        ? `لدينا ${matches.length} عقارات على الواجهة البحرية:\n\n`
        : `We have ${matches.length} waterfront / coastal properties:\n\n`;
      return header + matches.map(p => `• ${p.title} – ${formatPrice(p.price)} (${p.location})`).join('\n');
    }
  }

  if (q.includes('aspen') || q.includes('mountain') || q.includes('ski') || q.includes('montagne') || q.includes('أسبن')) {
    const p = properties.find(x => x.location.includes('Aspen'));
    if (p) {
      return `${p.title}\n${formatPrice(p.price)} • ${p.beds} beds • ${p.baths} baths\n\n${p.description}`;
    }
  }

  if ((q.includes('under') || q.includes('moins') || q.includes('أقل')) &&
      (q.includes('1m') || q.includes('1 m') || q.includes('million') || q.includes('مليون'))) {
    const matches = properties.filter(p => p.price < 1000000);
    const header = lang === 'fr' ? `Propriétés de moins de 1 M$ :\n\n` : lang === 'ar' ? `عقارات بأقل من مليون دولار:\n\n` : `Properties under $1M:\n\n`;
    return header + matches.map(p => `• ${p.title} – ${formatPrice(p.price)} (${p.location})`).join('\n');
  }

  if (q.includes('price') || q.includes('range') || q.includes('budget') || q.includes('prix') || q.includes('سعر')) {
    const prices = properties.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (lang === 'fr') return `Nos annonces vont de ${formatPrice(min)} à ${formatPrice(max)}. Quel est votre budget ?`;
    if (lang === 'ar') return `عقاراتنا تتراوح من ${formatPrice(min)} إلى ${formatPrice(max)}. ما هو ميزانيتك؟`;
    return `Our current listings range from ${formatPrice(min)} to ${formatPrice(max)}. What’s your budget range?`;
  }

  if (q.includes('viewing') || q.includes('tour') || q.includes('schedule') || q.includes('visite') || q.includes('معاينة') || q.includes('حجز')) {
    if (lang === 'fr') return "Je serai ravi d’organiser une visite privée. Merci de partager :\n\n1. Quelle propriété vous intéresse\n2. Vos dates préférées\n3. Votre nom et contact";
    if (lang === 'ar') return "يسعدني ترتيب معاينة خاصة. يرجى مشاركة:\n\n1. العقار الذي يهمك\n2. التواريخ المفضلة\n3. اسمك ورقم التواصل";
    return "I'd be happy to arrange a private viewing. Please share:\n\n1. Which property interests you\n2. Your preferred dates\n3. Your name and best contact";
  }

  return t.chatWelcome;
}

export default function Chatbot({ lang }: ChatbotProps) {
  const t = translations[lang];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', text: t.chatWelcome },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: 1, role: 'bot', text: t.chatWelcome }]);
  }, [lang]);

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
      const reply = getBotReply(text, lang);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
      setTyping(false);
    }, 700 + Math.random() * 600);
  };

  const quickReplies = [t.quick1, t.quick2, t.quick3, t.quick4, t.quick5];

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
                <strong>{t.chatTitle}</strong>
                <span className="chat-status">{t.chatStatus}</span>
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
              {quickReplies.map(q => (
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
              placeholder={t.chatPlaceholder}
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
