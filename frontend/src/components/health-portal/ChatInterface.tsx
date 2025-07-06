import { useState } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { azureOpenAIService } from "@/services/azure-openai";

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
}

const initialMessages = [
  {
    id: 1,
    type: 'ai',
    content: "Hello! I'm your AI assistant powered by Azure OpenAI. I can help you understand diagnostic results, explain medical terminology, and answer questions about patient conditions. What would you like to know?",
    timestamp: new Date()
  }
];

export const ChatInterface = ({ isOpen, onToggle }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant' as const,
        content: msg.content
      }));

      // Generate AI response using Azure OpenAI
      const aiResponse = await azureOpenAIService.generateChatResponse(
        userMessage.content,
        conversationHistory
      );

      const aiMessage = {
        id: messages.length + 2,
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai' as const,
        content: "I apologize, but I'm having trouble processing your request right now. Please ensure your Azure OpenAI configuration is set up correctly. You can still explore the diagnostic results and insights in the dashboard.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={onToggle}
        className={cn(
          "fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-primary glow-primary transition-all duration-300 z-50",
          isOpen && "rotate-180"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Interface */}
      <div className={cn(
        "fixed bottom-24 right-8 w-96 h-[500px] glass border border-border-strong rounded-xl transition-all duration-300 z-40",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-strong">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <MessageCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-glow" />
                  <span className="text-xs text-foreground-secondary">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] px-3 py-2 rounded-lg",
                  message.type === 'user'
                    ? "bg-gradient-primary text-primary-foreground"
                    : "glass border border-border-strong"
                )}>
                  <p className="text-sm">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border-strong">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about diagnostic results..."
                className="flex-1 glass"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                onClick={handleSend}
                className="bg-gradient-primary glow-primary"
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};