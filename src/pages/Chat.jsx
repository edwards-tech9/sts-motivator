import { useState, useEffect, useRef } from 'react';
import { Send, Image, Paperclip, Smile, ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { PageTransition, SlideIn } from '../components/ui/AnimatedComponents';
import { getMessages, saveMessage } from '../services/localStorage';

// Mock coach data
const coach = {
  id: 'coach-1',
  name: 'Coach Mike',
  avatar: 'CM',
  status: 'online',
  lastSeen: 'Active now',
};

// Initial demo messages
const initialMessages = [
  {
    id: 1,
    senderId: 'coach-1',
    text: "Hey! How did yesterday's workout feel? Any soreness from the heavy squats?",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    id: 2,
    senderId: 'athlete',
    text: "It was tough but good! My quads are definitely feeling it today 😅",
    timestamp: new Date(Date.now() - 85000000).toISOString(),
    read: true,
  },
  {
    id: 3,
    senderId: 'coach-1',
    text: "That's what I like to hear! Make sure you're getting enough protein and sleep. Tomorrow's session will be lighter - focusing on mobility and accessory work.",
    timestamp: new Date(Date.now() - 84000000).toISOString(),
    read: true,
  },
  {
    id: 4,
    senderId: 'coach-1',
    text: "Also, I noticed your squat depth has improved significantly over the past few weeks. Great work on the mobility drills! 💪",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load messages from localStorage or use initial
    const stored = getMessages();
    if (stored && stored.length > 0) {
      setMessages(stored);
    } else {
      setMessages(initialMessages);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: 'athlete',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveMessage(updatedMessages);
    setNewMessage('');

    // Simulate coach typing
    setTimeout(() => setIsTyping(true), 1000);

    // Simulate coach response
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Got it! I'll factor that into your next program update.",
        "Thanks for letting me know! Keep up the great work 💪",
        "Perfect! Remember to focus on form over weight.",
        "Sounds good! Let me know if you need any adjustments.",
        "Great progress! Keep pushing!",
      ];
      const coachResponse = {
        id: Date.now() + 1,
        senderId: 'coach-1',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        read: false,
      };
      const withResponse = [...updatedMessages, coachResponse];
      setMessages(withResponse);
      saveMessage(withResponse);
    }, 2500);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 172800000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-carbon-900/95 backdrop-blur-lg border-b border-slate-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-carbon-900 font-bold">
                  {coach.avatar}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-carbon-900" />
              </div>
              <div>
                <h1 className="text-white font-bold">{coach.name}</h1>
                <p className="text-green-400 text-xs">{coach.lastSeen}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 bg-carbon-800 rounded-full text-gray-500 cursor-not-allowed opacity-50"
                disabled
                title="Voice calls coming soon"
                aria-label="Voice call (coming soon)"
              >
                <Phone size={18} />
              </button>
              <button
                className="p-2 bg-carbon-800 rounded-full text-gray-500 cursor-not-allowed opacity-50"
                disabled
                title="Video calls coming soon"
                aria-label="Video call (coming soon)"
              >
                <Video size={18} />
              </button>
              <button
                className="p-2 bg-carbon-800 rounded-full text-gray-500 cursor-not-allowed opacity-50"
                disabled
                title="More options coming soon"
                aria-label="More options (coming soon)"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          {Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex justify-center mb-4">
                <span className="bg-carbon-800/80 text-gray-400 text-xs px-3 py-1 rounded-full">
                  {new Date(date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              {msgs.map((message, index) => {
                const isOwn = message.senderId === 'athlete';
                return (
                  <SlideIn key={message.id} direction={isOwn ? 'right' : 'left'} delay={index * 50}>
                    <div className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {!isOwn && (
                        <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-carbon-900 text-xs font-bold mr-2 flex-shrink-0">
                          {coach.avatar}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                          isOwn
                            ? 'bg-gold-500 text-carbon-900 rounded-br-sm'
                            : 'bg-carbon-800 text-white rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-carbon-700' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </SlideIn>
                );
              })}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-carbon-900 text-xs font-bold">
                {coach.avatar}
              </div>
              <div className="bg-carbon-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-16 left-0 right-0 bg-carbon-900/95 backdrop-blur-lg border-t border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-500 cursor-not-allowed opacity-50"
              disabled
              title="Attachments coming soon"
              aria-label="Attach file (coming soon)"
            >
              <Paperclip size={20} />
            </button>
            <button
              className="p-2 text-gray-500 cursor-not-allowed opacity-50"
              disabled
              title="Images coming soon"
              aria-label="Send image (coming soon)"
            >
              <Image size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full bg-carbon-800 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder-gray-500"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-not-allowed opacity-50"
                disabled
                title="Emoji picker coming soon"
                aria-label="Add emoji (coming soon)"
              >
                <Smile size={20} />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="p-3 bg-gold-500 rounded-full text-carbon-900 hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;
