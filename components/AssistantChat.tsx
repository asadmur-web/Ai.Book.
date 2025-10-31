import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { AssistantChatMessage } from '../types';

const AssistantChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'أنت مساعد ذكي في موقع اسمه "AI Book". وظيفتك هي مساعدة المستخدمين في فهم الموقع والإجابة على أسئلتهم. الموقع يقدم ثلاث أدوات: صانع الامتحانات، شرح الدروس، وباني المشاريع. كن ودودًا ومساعدًا. عرف بنفسك في البداية.',
        },
      });

      // Send initial message from the model
      const sendInitialMessage = async () => {
        setIsLoading(true);
        try {
          const response = await chatRef.current!.sendMessage({ message: "مرحباً" });
          setMessages([{
            id: 'init',
            role: 'model',
            text: response.text
          }]);
        } catch (error) {
          console.error("Error sending initial message:", error);
          setMessages([{
            id: 'init-error',
            role: 'model',
            text: "مرحباً! أنا مساعد AI Book. كيف يمكنني مساعدتك اليوم؟"
          }]);
        } finally {
          setIsLoading(false);
        }
      };
      
      if (messages.length === 0) {
        sendInitialMessage();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chatRef.current) return;

    const userMessage: AssistantChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userInput,
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userInput });
      const modelMessage: AssistantChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: AssistantChatMessage = {
        id: 'error-' + Date.now(),
        role: 'model',
        text: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform z-50 btn-glow"
        aria-label="افتح دردشة المساعد"
      >
        <MessageSquare size={32} />
      </button>
    );
  }

  return (
    <div className="chat-widget-container fixed bottom-5 right-5 w-full max-w-sm h-[70vh] max-h-[600px] bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Bot className="text-purple-400" />
          <h3 className="font-bold text-lg font-orbitron">المساعد الذكي</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <Bot className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />}
            <div className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-800 rounded-bl-none'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.role === 'user' && <User className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <Bot className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
             <div className="max-w-xs md:max-w-sm rounded-xl px-4 py-2 bg-gray-800 rounded-bl-none flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-500/20 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 bg-gray-800 rounded-full p-1 glow-on-focus">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="اسأل أي شيء..."
            className="flex-grow bg-transparent px-4 py-2 text-sm focus:outline-none"
            disabled={isLoading}
          />
          <button type="submit" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center disabled:opacity-50" disabled={isLoading}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssistantChat;
