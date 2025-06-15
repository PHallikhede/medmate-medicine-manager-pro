
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your MedMate AI assistant. I can help you with questions about medicines, health tips, drug interactions, and more. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Medical and health-related responses
    if (lowerMessage.includes("headache") || lowerMessage.includes("pain")) {
      return "For headaches, you might consider over-the-counter pain relievers like acetaminophen or ibuprofen. However, if headaches persist or are severe, please consult with a healthcare professional. Make sure to follow dosage instructions on the medication.";
    }
    
    if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
      return "For fever management, acetaminophen or ibuprofen can help reduce temperature. Stay hydrated, rest, and monitor your temperature. If fever is high (over 103°F/39.4°C) or persists for more than 3 days, seek medical attention.";
    }
    
    if (lowerMessage.includes("drug interaction") || lowerMessage.includes("medication") || lowerMessage.includes("medicine")) {
      return "Drug interactions can be serious. Always inform your doctor or pharmacist about all medications you're taking, including over-the-counter drugs and supplements. Use the drug interaction checker in our app, but always verify with a healthcare professional.";
    }
    
    if (lowerMessage.includes("reminder") || lowerMessage.includes("schedule")) {
      return "Setting medication reminders is crucial for treatment effectiveness. Use our reminder feature to set up alerts for your medications. Take medicines at the same time each day for best results.";
    }
    
    if (lowerMessage.includes("side effect")) {
      return "Side effects vary by medication. Common ones include nausea, dizziness, or drowsiness. Always read medication labels and consult your doctor if you experience concerning side effects. Never stop prescribed medications without medical guidance.";
    }
    
    if (lowerMessage.includes("dosage") || lowerMessage.includes("dose")) {
      return "Always follow the dosage instructions provided by your doctor or on the medication label. Never exceed recommended doses. If you miss a dose, take it as soon as you remember, unless it's almost time for the next dose.";
    }
    
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! I'm here to help with any health or medication questions. Remember, while I can provide general information, always consult healthcare professionals for personalized medical advice.";
    }
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm here to help you with medication management, health tips, and general wellness questions. What would you like to know?";
    }
    
    // Default response for other queries
    return "I understand you're asking about health or medication topics. While I can provide general information, I recommend consulting with a healthcare professional for personalized medical advice. Is there a specific medication or health topic you'd like to know more about?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">MedMate AI</h3>
                <p className="text-xs text-white/80">Your health assistant</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                {!message.isUser && (
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 p-2 rounded-full flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[280px] p-3 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.isUser && (
                  <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-full flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="bg-gradient-to-br from-blue-100 to-green-100 p-2 rounded-full flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-slate-100 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about medicines, health tips..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
